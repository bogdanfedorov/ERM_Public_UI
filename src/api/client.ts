import { v7 as uuidv7 } from 'uuid'
import { z } from 'zod'
import { ActionResultSchema, type ActionResult, type RequestOptions, type Transport } from './generated'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, text: string) {
    super(text)
    this.status = status
  }
}

export class ActionDenied extends Error {
  readonly result: ActionResult

  constructor(result: ActionResult) {
    super('denied')
    this.result = result
  }
}

export const newIntentKey = () => uuidv7()

const query = (params?: Record<string, unknown>) => {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue
    if (Array.isArray(value)) value.forEach((v) => search.append(key, String(v)))
    else search.append(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

export const createApi = (tenantId?: string, intentKey?: string): Transport => ({
  async request(method, path, options: RequestOptions = {}) {
    const headers = new Headers({ 'X-Trace-ID': uuidv7() })
    if (tenantId) headers.set('X-Tenant-ID', tenantId)
    if (intentKey) headers.set('Idempotency-Key', intentKey)
    const hasBody = options.body !== undefined && method !== 'GET'
    if (hasBody) headers.set('Content-Type', 'application/json')

    const response = await fetch('/api' + path + query(options.query), {
      method,
      headers,
      credentials: 'same-origin',
      body: hasBody ? JSON.stringify(options.body) : undefined,
    })

    if (response.status === 204) return undefined
    const contentType = response.headers.get('content-type') ?? ''
    const data = contentType.includes('application/json') ? await response.json() : await response.text()

    if (response.ok) return data
    if (response.status === 403 && isActionResult(data)) throw new ActionDenied(data)
    throw new ApiError(response.status, typeof data === 'string' ? data : response.statusText)
  },
})

const isActionResult = (value: unknown): value is ActionResult => z.object({ outcome: z.string() }).safeParse(value).success

export { ActionResultSchema }
