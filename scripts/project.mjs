import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const log = []

const say = (line) => log.push(line)

const parseArgs = (argv) => {
  const flags = { gT: false, gS: false, gI: false, vT: false, vS: false, vI: false }
  let specFile = resolve(root, 'PROJECT.md')
  let outFile
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-f') specFile = resolve(root, argv[++i])
    else if (arg === '-o') outFile = resolve(root, argv[++i])
    else if (arg === '-gT') flags.gT = true
    else if (arg === '-gS') flags.gS = true
    else if (arg === '-gI') flags.gI = true
    else if (arg === '-vT') flags.vT = true
    else if (arg === '-vS') flags.vS = true
    else if (arg === '-vI') flags.vI = true
    else throw new Error(`unknown argument: ${arg}`)
  }
  return { specFile, outFile, flags }
}

const parseProject = (markdown) => {
  const lines = markdown.split('\n')
  const apis = []
  const features = {}
  const routes = []
  let section = null
  let domain = null
  let feature = null
  let route = null

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^##\s+/.test(line)) {
      const title = line.replace(/^##\s+/, '').trim().toLowerCase()
      section = /^fe?tures?$/.test(title) ? 'feature' : title
      domain = null
      feature = null
      route = null
      continue
    }
    if (section === 'feature' && /^###\s+/.test(line)) {
      domain = line.replace(/^###\s+/, '').trim()
      features[domain] ??= {}
      feature = null
      continue
    }
    if (section === 'feature' && /^####\s+/.test(line)) {
      feature = line.replace(/^####\s+/, '').trim()
      features[domain][feature] = []
      continue
    }
    if (section === 'api') {
      const m = line.match(/^\s*-\s*\[file:openapi\]\(([^)]+)\)(?:\s+as\s+(\S+))?/)
      if (m) apis.push({ path: m[1], alias: m[2] ?? 'local' })
      continue
    }
    if (section === 'feature' && feature) {
      const m = line.match(/^\s*\[(\w+)\]\s+(\w+)\(([^)]*)\)\s*:\s*\[SDK\.([\w.]+)\]\(#sdk(?:::(\S+))?\)/)
      if (m) {
        features[domain][feature].push({
          marker: m[1],
          fnName: m[2],
          args: m[3],
          sdkPath: m[4],
          apiAlias: m[5] ?? 'local',
        })
      }
      continue
    }
    if (section === 'router') {
      const pathMatch = line.match(/^-\s*(\/\S*)\s*$/)
      if (pathMatch) {
        route = { path: pathMatch[1], name: null, component: null }
        routes.push(route)
        continue
      }
      if (route) {
        const nameMatch = line.match(/^\s*-\s*name\s+(\S+)/)
        if (nameMatch) route.name = nameMatch[1]
        const compMatch = line.match(/^\s*-\s*component\s+\[([^\]]+)\]\(#([\w-]+)\)/)
        if (compMatch) route.component = compMatch[1]
      }
    }
  }

  return { apis, features, routes }
}

const findFeature = (features, name) => {
  for (const [domain, byName] of Object.entries(features)) {
    for (const featureName of Object.keys(byName)) {
      if (featureName.toLowerCase() === name.toLowerCase()) {
        return { domain, featureName, lines: byName[featureName] }
      }
    }
  }
  return null
}

const camelCase = (s) => s.split(/[_-]/).map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('')

const lowerFirst = (s) => s[0].toLowerCase() + s.slice(1)

const resolveResponseType = (operation) => {
  const responses = operation.responses ?? {}
  const ok = responses['200'] ?? responses['201'] ?? responses['204']
  const schema = ok?.content?.['application/json']?.schema
  if (!schema) return 'unknown'
  if (schema.$ref) return `Schemas['${schema.$ref.split('/').pop()}']`
  if (schema.type === 'array' && schema.items?.$ref) return `Schemas['${schema.items.$ref.split('/').pop()}'][]`
  return 'unknown'
}

const collectOperations = (spec) => {
  const operations = []
  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [httpMethod, operation] of Object.entries(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(httpMethod)) continue
      operations.push({
        path,
        httpMethod: httpMethod.toUpperCase(),
        operationId: operation.operationId,
        tag: operation.tags?.[0] ?? 'misc',
        responseType: resolveResponseType(operation),
      })
    }
  }
  return operations
}

const buildSdkIndex = (operations) => {
  const index = {}
  const usedByGroup = {}
  for (const op of operations) {
    const group = camelCase(op.tag)
    index[group] ??= {}
    usedByGroup[group] ??= new Set()
    const prefixed = op.operationId.toLowerCase().startsWith(group.toLowerCase())
    let method = prefixed && op.operationId.length > group.length
      ? lowerFirst(op.operationId.slice(group.length))
      : lowerFirst(op.operationId)
    if (usedByGroup[group].has(method)) method = lowerFirst(op.operationId)
    usedByGroup[group].add(method)
    index[group][method] = op
  }
  return index
}

const lookupSdkEntry = (sdkIndex, sdkPath) => {
  const [group, method] = sdkPath.split('.')
  const entry = sdkIndex[group]?.[method]
  if (!entry) throw new Error(`SDK.${sdkPath} does not match any operation generated from the openapi spec`)
  return entry
}

const patchOpenApiSpec = (spec) => {
  const resolveParam = (param) =>
    param.$ref ? spec.components.parameters[param.$ref.split('/').pop()] : param
  for (const path of Object.values(spec.paths)) {
    for (const operation of Object.values(path)) {
      if (operation.parameters) {
        operation.parameters = operation.parameters.filter((p) => resolveParam(p).in !== 'header')
      }
    }
  }
  const openObjects = (node) => {
    if (Array.isArray(node)) return node.forEach(openObjects)
    if (!node || typeof node !== 'object') return
    if (node.type === 'object' && !node.properties && node.additionalProperties === undefined) {
      node.additionalProperties = true
    }
    Object.values(node).forEach(openObjects)
  }
  openObjects(spec.components.schemas)
  openObjects(spec.paths)
  return spec
}

const loadOpenApi = (apiRef) => JSON.parse(readFileSync(resolve(root, apiRef.path), 'utf8'))

const schemaOutPath = (apis, alias) =>
  resolve(root, apis.length > 1 ? `src/api/${alias}.schema.d.ts` : 'src/api/schema.d.ts')

const sdkOutPath = (apis, alias) =>
  resolve(root, apis.length > 1 ? `src/api/${alias}.sdk.generated.ts` : 'src/api/sdk.generated.ts')

const renderSdkFile = (sdkIndex) => {
  const groups = Object.entries(sdkIndex).map(([group, methods]) => {
    const body = Object.entries(methods)
      .map(
        ([method, op]) =>
          `    ${method}: (init?: Parameters<Api['${op.httpMethod}']>[1]) => api.${op.httpMethod}('${op.path}', init),`,
      )
      .join('\n')
    return `  ${group}: {\n${body}\n  },`
  })
  return `import type { Api } from './client'\n\nexport const createSdk = (api: Api) => ({\n${groups.join('\n')}\n})\n`
}

const ensureImport = (text, importLine) => {
  if (text.includes(importLine)) return text
  const lines = text.split('\n')
  let lastImport = -1
  for (let i = 0; i < lines.length; i++) if (/^import /.test(lines[i])) lastImport = i
  lines.splice(lastImport + 1, 0, importLine)
  return lines.join('\n')
}

const matchBlock = (text, openIndex, openChar, closeChar) => {
  let depth = 0
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === openChar) depth++
    else if (text[i] === closeChar) {
      depth--
      if (depth === 0) return i
    }
  }
  throw new Error('unbalanced braces while locating block')
}

const relativeImport = (fromFile, toFile) => {
  const rel = relative(dirname(fromFile), toFile).replace(/\\/g, '/').replace(/\.ts$/, '')
  return rel.startsWith('.') ? rel : `./${rel}`
}

const renderPropsType = (lines, sdkIndex) => {
  const byMarker = {}
  for (const line of lines) {
    const entry = lookupSdkEntry(sdkIndex, line.sdkPath)
    byMarker[line.marker] ??= []
    byMarker[line.marker].push(`    ${line.fnName}: () => { data: Ref<${entry.responseType} | undefined> }`)
  }
  const body = Object.entries(byMarker)
    .map(([marker, fields]) => `  ${marker}: {\n${fields.join('\n')}\n  }`)
    .join('\n')
  return `defineProps<{\n${body}\n}>()`
}

const injectDefineProps = (fileText, filePath, lines, sdkIndex) => {
  const needsSchemas = lines.some((l) => lookupSdkEntry(sdkIndex, l.sdkPath).responseType.startsWith("Schemas"))
  let text = ensureImport(fileText, "import { type Ref } from 'vue'")
  if (needsSchemas) {
    text = ensureImport(text, `import type { Schemas } from '${relativeImport(filePath, resolve(root, 'src/api/client.ts'))}'`)
  }
  const newBlock = `const props = ${renderPropsType(lines, sdkIndex)}`
  const existing = text.match(/const props = defineProps<\{[\s\S]*?\}>\(\)/)
  if (existing) return text.replace(existing[0], newBlock)
  const lines_ = text.split('\n')
  let lastImport = -1
  for (let i = 0; i < lines_.length; i++) if (/^import /.test(lines_[i])) lastImport = i
  lines_.splice(lastImport + 1, 0, '', newBlock)
  return lines_.join('\n')
}

const renderRouterPropsObject = (lines, sdkIndex) => {
  const byMarker = {}
  for (const line of lines) {
    lookupSdkEntry(sdkIndex, line.sdkPath)
    const [, method] = line.sdkPath.split('.')
    byMarker[line.marker] ??= []
    byMarker[line.marker].push(
      `          ${line.fnName}: () => useQuery(queryOptions({\n` +
        `            queryKey: ['${method}'],\n` +
        `            queryFn: () => unwrap(SDK.${line.sdkPath}(${line.args})),\n` +
        `            staleTime: 60_000,\n` +
        `          })),`,
    )
  }
  const body = Object.entries(byMarker)
    .map(([marker, fields]) => `        ${marker}: {\n${fields.join('\n')}\n        }`)
    .join(',\n')
  return `props: () => ({\n${body}\n      })`
}

const injectRouterProps = (fileText, filePath, routePath, propsObjectText) => {
  let text = ensureImport(fileText, "import { queryOptions, useQuery } from '@tanstack/vue-query'")
  text = ensureImport(text, `import { createSdk } from '${relativeImport(filePath, resolve(root, 'src/api/sdk.generated.ts'))}'`)
  text = ensureImport(text, `import { createApi, unwrap } from '${relativeImport(filePath, resolve(root, 'src/api/client.ts'))}'`)
  if (!text.includes('const SDK = createSdk(createApi())')) {
    text = ensureImport(text, '\nconst SDK = createSdk(createApi())')
  }

  const anchor = `path: '${routePath}'`
  const anchorIndex = text.indexOf(anchor)
  if (anchorIndex === -1) throw new Error(`router.ts has no route for path ${routePath}`)
  const openBrace = text.lastIndexOf('{', anchorIndex)
  const closeBrace = matchBlock(text, openBrace, '{', '}')
  const routeBlock = text.slice(openBrace, closeBrace + 1)

  const propsMatch = routeBlock.match(/props:\s*\(\)\s*=>\s*/)
  let newRouteBlock
  if (propsMatch) {
    const propsStart = propsMatch.index
    const openParen = routeBlock.indexOf('(', propsStart + propsMatch[0].length)
    const closeParen = matchBlock(routeBlock, openParen, '(', ')')
    let end = closeParen + 1
    if (routeBlock[end] === ',') end++
    newRouteBlock = `${routeBlock.slice(0, propsStart)}${propsObjectText},${routeBlock.slice(end)}`
  } else {
    const withoutTrailingBrace = routeBlock.slice(0, -1).replace(/\s*,?\s*$/, '')
    newRouteBlock = `${withoutTrailingBrace}\n      , ${propsObjectText} }`
  }

  return text.slice(0, openBrace) + newRouteBlock + text.slice(closeBrace + 1)
}

const diffLines = (expected, actual, label) => {
  if (expected === actual) return []
  const a = expected.split('\n')
  const b = actual.split('\n')
  const out = [`--- ${label} (generated) vs (on disk)`]
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) {
      if (a[i] !== undefined) out.push(`- ${a[i]}`)
      if (b[i] !== undefined) out.push(`+ ${b[i]}`)
    }
  }
  return out
}

const writeOrCheck = (filePath, content, validateOnly, problems) => {
  if (validateOnly) {
    const actual = existsSync(filePath) ? readFileSync(filePath, 'utf8') : ''
    const diffs = diffLines(content, actual, relative(root, filePath))
    if (diffs.length) problems.push(...diffs)
    say(diffs.length ? `[vt] mismatch: ${relative(root, filePath)}` : `[vt] ok: ${relative(root, filePath)}`)
    return
  }
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
  say(`wrote ${relative(root, filePath)}`)
}

const runTypes = async (project, flags, problems) => {
  for (const apiRef of project.apis) {
    const spec = patchOpenApiSpec(loadOpenApi(apiRef))
    const content = astToString(await openapiTS(spec))
    writeOrCheck(schemaOutPath(project.apis, apiRef.alias), content, flags.vT, problems)
  }
}

const runSdk = (project, flags, problems) => {
  for (const apiRef of project.apis) {
    const spec = loadOpenApi(apiRef)
    const sdkIndex = buildSdkIndex(collectOperations(spec))
    const content = renderSdkFile(sdkIndex)
    writeOrCheck(sdkOutPath(project.apis, apiRef.alias), content, flags.vS, problems)
  }
}

const sdkIndexForAlias = (project, alias) => {
  const apiRef = project.apis.find((a) => a.alias === alias) ?? project.apis[0]
  return buildSdkIndex(collectOperations(loadOpenApi(apiRef)))
}

const runInjection = (project, flags, problems) => {
  for (const route of project.routes) {
    if (!route.component) continue
    const found = findFeature(project.features, route.component)
    if (!found) throw new Error(`Router component ${route.component} has no matching ## feature entry`)
    const sdkIndex = sdkIndexForAlias(project, found.lines[0]?.apiAlias ?? 'local')

    const featurePath = resolve(root, `src/features/${found.domain}/${found.featureName}.vue`)
    const featureText = readFileSync(featurePath, 'utf8')
    const newFeatureText = injectDefineProps(featureText, featurePath, found.lines, sdkIndex)
    writeOrCheck(featurePath, newFeatureText, flags.vI, problems)

    const routerPath = resolve(root, 'src/app/router.ts')
    const routerText = readFileSync(routerPath, 'utf8')
    const propsObject = renderRouterPropsObject(found.lines, sdkIndex)
    const newRouterText = injectRouterProps(routerText, routerPath, route.path, propsObject)
    writeOrCheck(routerPath, newRouterText, flags.vI, problems)
  }
}

const main = async () => {
  const { specFile, outFile, flags } = parseArgs(process.argv.slice(2))
  const project = parseProject(readFileSync(specFile, 'utf8'))
  const problems = []

  if (flags.gT || flags.vT) await runTypes(project, flags, problems)
  if (flags.gS || flags.vS) runSdk(project, flags, problems)
  if (flags.gI || flags.vI) runInjection(project, flags, problems)

  const report = log.concat(problems).join('\n')
  if (outFile) writeFileSync(outFile, report + '\n')
  else if (report) console.log(report)

  if (problems.length) process.exit(1)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
