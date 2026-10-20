import { readFileSync, writeFileSync } from 'node:fs'
import openapiTS, { astToString } from 'openapi-typescript'

const [source, target] = process.argv.slice(2)
const spec = JSON.parse(readFileSync(source, 'utf8'))

const resolve = (param) =>
  param.$ref ? spec.components.parameters[param.$ref.split('/').pop()] : param

for (const path of Object.values(spec.paths)) {
  for (const operation of Object.values(path)) {
    if (operation.parameters) {
      operation.parameters = operation.parameters.filter((param) => resolve(param).in !== 'header')
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

writeFileSync(target, astToString(await openapiTS(spec)))
