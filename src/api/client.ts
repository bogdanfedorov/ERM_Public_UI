import createClient, { type Middleware } from 'openapi-fetch'
import { v7 as uuidv7 } from 'uuid'
import type { components, paths } from './schema'

export type Schemas = components['schemas']

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, text: string) {
    super(text)
    this.status = status
  }
}

export const newIntentKey = () => uuidv7()

const traced: Middleware = {
  onRequest({ request }) {
    request.headers.set('X-Trace-ID', uuidv7())
    return request
  },
}

const tenantScoped = (tenantId: string): Middleware => ({
  onRequest({ request }) {
    request.headers.set('X-Tenant-ID', tenantId)
    return request
  },
})

export const createApi = (tenantId?: string) => {
  const client = createClient<paths>({ baseUrl: '/api', credentials: 'same-origin' })
  client.use(traced)
  if (tenantId) client.use(tenantScoped(tenantId))
  return client
}

export type Api = ReturnType<typeof createApi>

type Result<T> = { data?: T; error?: unknown; response: Response }

export const unwrap = async <T>(call: Promise<Result<T>>): Promise<T> => {
  const { data, error, response } = await call
  if (data !== undefined && response.ok) return data
  throw new ApiError(response.status, typeof error === 'string' ? error : response.statusText)
}
