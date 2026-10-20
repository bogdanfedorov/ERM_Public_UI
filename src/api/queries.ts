import { queryOptions } from '@tanstack/vue-query'
import { ApiError, createApi, newIntentKey, unwrap, type Api, type Schemas } from './client'
import type { Permit, Rule } from '../model/access'
import type { FieldIndex, FieldType } from '../model/fields'

export type Entity = 'person' | 'offering' | 'enrollment' | 'attendance' | 'session'

type FieldBody = { title: string; required: boolean; options?: string[]; index: FieldIndex }

export const meQuery = () =>
  queryOptions({
    queryKey: ['me'],
    queryFn: () => unwrap(createApi().GET('/me')),
    staleTime: 60_000,
  })

export const tenantQueries = (tenantId: string) => {
  const api: Api = createApi(tenantId)
  const key = (...parts: unknown[]) => [tenantId, ...parts]

  return {
    key,

    fields: (entity: Entity) =>
      queryOptions({
        queryKey: key('fields', entity),
        queryFn: () => unwrap(api.GET('/fields/{entity}', { params: { path: { entity } } })),
        staleTime: 5 * 60_000,
      }),

    people: () =>
      pages({
        queryKey: key('person', 'list'),
        queryFn: ({ pageParam }) =>
          unwrap(api.GET('/people', { params: { query: { limit: 200, cursor: pageParam } } })),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (page) => page.next_cursor,
      }),

    person: (id: string) =>
      queryOptions({
        queryKey: key('person', id),
        queryFn: () => unwrap(api.GET('/people/{person_id}', { params: { path: { person_id: id } } })),
      }),

    offerings: () =>
      pages({
        queryKey: key('offering', 'list'),
        queryFn: ({ pageParam }) =>
          unwrap(api.GET('/offerings', { params: { query: { limit: 200, cursor: pageParam } } })),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (page) => page.next_cursor,
      }),

    offering: (id: string) =>
      queryOptions({
        queryKey: key('offering', id),
        queryFn: () => unwrap(api.GET('/offerings/{offering_id}', { params: { path: { offering_id: id } } })),
      }),

    enrollments: (filter: { person_id?: string; offering_id?: string }) =>
      queryOptions({
        queryKey: key('enrollment', 'list', filter),
        queryFn: () => unwrap(api.GET('/enrollments', { params: { query: { limit: 200, ...filter } } })),
      }),

    attendances: (filter: { person_id?: string; offering_id?: string }) =>
      queryOptions({
        queryKey: key('attendance', 'list', filter),
        queryFn: () => unwrap(api.GET('/attendances', { params: { query: { limit: 200, ...filter } } })),
      }),

    schedule: (window: { from: string; to: string }) =>
      queryOptions({
        queryKey: key('schedule', window),
        queryFn: () => unwrap(api.GET('/schedule', { params: { query: window } })),
      }),

    groups: () =>
      queryOptions({
        queryKey: key('access', 'groups'),
        queryFn: () => unwrap(api.GET('/groups', { params: { query: { limit: 200 } } })),
      }),

    permits: () =>
      queryOptions({
        queryKey: key('access', 'permits'),
        queryFn: () => unwrap(api.GET('/permits')),
      }),

    invites: () =>
      queryOptions({
        queryKey: key('access', 'invites'),
        queryFn: () => unwrap(api.GET('/invites', { params: { query: { limit: 200 } } })),
      }),

    createPerson: (attrs: Record<string, unknown>, intentKey: string) =>
      runAction(api.POST('/people', { body: { attrs }, headers: { 'Idempotency-Key': intentKey } })),

    invite: (body: { person_id: string; identifier: string; permit: Permit }, intentKey: string) =>
      runAction(api.POST('/invites', { body, headers: { 'Idempotency-Key': intentKey } })),

    withdrawInvite: (inviteId: string, intentKey: string) =>
      runAction(
        api.DELETE('/invites/{invite_id}', {
          params: { path: { invite_id: inviteId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    acceptInvite: (inviteId: string, intentKey: string) =>
      runAction(
        api.POST('/invites/{invite_id}/accept', {
          params: { path: { invite_id: inviteId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    setPermit: (personId: string, permit: Permit, intentKey: string) =>
      runAction(
        api.PATCH('/people/{person_id}/permit', {
          params: { path: { person_id: personId } },
          body: { permit },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    createGroup: (body: { name: string; rules: Rule[] }, intentKey: string) =>
      runAction(api.POST('/groups', { body, headers: { 'Idempotency-Key': intentKey } })),

    updateGroup: (groupId: string, body: { name: string; rules: Rule[] }, intentKey: string) =>
      runAction(
        api.PATCH('/groups/{access_group_id}', {
          params: { path: { access_group_id: groupId } },
          body,
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    deleteGroup: (groupId: string, intentKey: string) =>
      runAction(
        api.DELETE('/groups/{access_group_id}', {
          params: { path: { access_group_id: groupId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    createField: (body: FieldBody & { entity: Entity; key: string; type: FieldType }, intentKey: string) =>
      runAction(api.POST('/field_definitions', { body, headers: { 'Idempotency-Key': intentKey } })),

    updateField: (fieldId: string, body: FieldBody, intentKey: string) =>
      runAction(
        api.PATCH('/field_definitions/{field_definition_id}', {
          params: { path: { field_definition_id: fieldId } },
          body,
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    moveField: (fieldId: string, afterId: string | undefined, intentKey: string) =>
      runAction(
        api.POST('/field_definitions/{field_definition_id}/move', {
          params: { path: { field_definition_id: fieldId } },
          body: { after_id: afterId },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    archiveField: (fieldId: string, intentKey: string) =>
      runAction(
        api.POST('/field_definitions/{field_definition_id}/archive', {
          params: { path: { field_definition_id: fieldId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    restoreField: (fieldId: string, intentKey: string) =>
      runAction(
        api.POST('/field_definitions/{field_definition_id}/restore', {
          params: { path: { field_definition_id: fieldId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    revoke: (personId: string, intentKey: string) =>
      runAction(
        api.DELETE('/people/{person_id}/permit', {
          params: { path: { person_id: personId } },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),

    enroll: (offeringId: string, personId: string, intentKey: string) =>
      runAction(
        api.POST('/offerings/{offering_id}/enrollments', {
          params: { path: { offering_id: offeringId } },
          body: { person_id: personId },
          headers: { 'Idempotency-Key': intentKey },
        }),
      ),
  }
}

type Page = { next_cursor?: string }

const pages = <T extends Page>(options: {
  queryKey: unknown[]
  queryFn: (context: { pageParam: string | undefined }) => Promise<T>
  initialPageParam: string | undefined
  getNextPageParam: (page: T) => string | undefined
}) => options

export type TenantQueries = ReturnType<typeof tenantQueries>

export class ActionDenied extends Error {
  readonly result: Schemas['ActionResult']

  constructor(result: Schemas['ActionResult']) {
    super('denied')
    this.result = result
  }
}

type ActionCall = Promise<{
  data?: Schemas['ActionResult']
  error?: unknown
  response: Response
}>

const runAction = async (call: ActionCall) => {
  const { data, error, response } = await call
  if (data && response.ok) return data
  if (response.status === 403 && isActionResult(error)) throw new ActionDenied(error)
  throw new ApiError(response.status, typeof error === 'string' ? error : response.statusText)
}

const isActionResult = (value: unknown): value is Schemas['ActionResult'] =>
  typeof value === 'object' && value !== null && 'outcome' in value

export { newIntentKey }
