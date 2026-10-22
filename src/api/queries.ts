import { queryOptions } from '@tanstack/vue-query'
import { ActionDenied, createApi, newIntentKey } from './client'
import * as sdk from './generated'
import type { Permit, Rule } from '../model/access'
import type { FieldIndex, FieldType } from '../model/fields'

export type { ActionResult } from './generated'
export type Entity = 'person' | 'offering' | 'enrollment' | 'attendance' | 'session'

type FieldBody = { title: string; required: boolean; options?: string[]; index: FieldIndex }

export const meQuery = () =>
  queryOptions({
    queryKey: ['me'],
    queryFn: () => sdk.me(createApi()),
    staleTime: 60_000,
  })

export const tenantQueries = (tenantId: string) => {
  const http = createApi(tenantId)
  const action = (intentKey: string) => createApi(tenantId, intentKey)
  const key = (...parts: unknown[]) => [tenantId, ...parts]

  return {
    key,

    fields: (entity: Entity) =>
      queryOptions({
        queryKey: key('fields', entity),
        queryFn: () => sdk.fieldList(http, { entity }),
        staleTime: 5 * 60_000,
      }),

    people: () =>
      pages({
        queryKey: key('person', 'list'),
        queryFn: ({ pageParam }) => sdk.personList(http, { limit: 200, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (page) => page.next_cursor,
      }),

    person: (id: string) =>
      queryOptions({
        queryKey: key('person', id),
        queryFn: () => sdk.personGet(http, id),
      }),

    offerings: () =>
      pages({
        queryKey: key('offering', 'list'),
        queryFn: ({ pageParam }) => sdk.offeringList(http, { limit: 200, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (page) => page.next_cursor,
      }),

    offering: (id: string) =>
      queryOptions({
        queryKey: key('offering', id),
        queryFn: () => sdk.offeringGet(http, id),
      }),

    enrollments: (filter: { person_id?: string; offering_id?: string }) =>
      queryOptions({
        queryKey: key('enrollment', 'list', filter),
        queryFn: () => sdk.enrollmentList(http, { limit: 200, ...filter }),
      }),

    attendances: (filter: { person_id?: string; offering_id?: string }) =>
      queryOptions({
        queryKey: key('attendance', 'list', filter),
        queryFn: () => sdk.attendanceList(http, { limit: 200, ...filter }),
      }),

    schedule: (window: { from: string; to: string }) =>
      queryOptions({
        queryKey: key('schedule', window),
        queryFn: () => sdk.scheduleList(http, window),
      }),

    groups: () =>
      queryOptions({
        queryKey: key('access', 'groups'),
        queryFn: () => sdk.accessGroupList(http, { limit: 200 }),
      }),

    permits: () =>
      queryOptions({
        queryKey: key('access', 'permits'),
        queryFn: () => sdk.permitList(http),
      }),

    invites: () =>
      queryOptions({
        queryKey: key('access', 'invites'),
        queryFn: () => sdk.inviteList(http, { limit: 200 }),
      }),

    createPerson: (attrs: Record<string, unknown>, intentKey: string) =>
      sdk.personCreate(action(intentKey), { attrs }),

    invite: (body: { person_id: string; identifier: string; permit: Permit }, intentKey: string) =>
      sdk.inviteCreate(action(intentKey), body),

    withdrawInvite: (inviteId: string, intentKey: string) =>
      sdk.inviteDelete(action(intentKey), { invite_id: inviteId }),

    acceptInvite: (inviteId: string, intentKey: string) =>
      sdk.inviteAccept(action(intentKey), { invite_id: inviteId }),

    setPermit: (personId: string, permit: Permit, intentKey: string) =>
      sdk.personSetPermit(action(intentKey), { person_id: personId, permit }),

    createGroup: (body: { name: string; rules: Rule[] }, intentKey: string) =>
      sdk.accessGroupCreate(action(intentKey), body),

    updateGroup: (groupId: string, body: { name: string; rules: Rule[] }, intentKey: string) =>
      sdk.accessGroupUpdate(action(intentKey), { access_group_id: groupId, ...body }),

    deleteGroup: (groupId: string, intentKey: string) =>
      sdk.accessGroupDelete(action(intentKey), { access_group_id: groupId }),

    createField: (body: FieldBody & { entity: Entity; key: string; type: FieldType }, intentKey: string) =>
      sdk.fieldDefinitionCreate(action(intentKey), body),

    updateField: (fieldId: string, body: FieldBody, intentKey: string) =>
      sdk.fieldDefinitionUpdate(action(intentKey), { field_definition_id: fieldId, ...body }),

    moveField: (fieldId: string, afterId: string | undefined, intentKey: string) =>
      sdk.fieldDefinitionMove(action(intentKey), { field_definition_id: fieldId, after_id: afterId }),

    archiveField: (fieldId: string, intentKey: string) =>
      sdk.fieldDefinitionArchive(action(intentKey), { field_definition_id: fieldId }),

    restoreField: (fieldId: string, intentKey: string) =>
      sdk.fieldDefinitionRestore(action(intentKey), { field_definition_id: fieldId }),

    revoke: (personId: string, intentKey: string) =>
      sdk.personRevoke(action(intentKey), { person_id: personId }),

    enroll: (offeringId: string, personId: string, intentKey: string) =>
      sdk.enrollmentCreate(action(intentKey), { offering_id: offeringId, person_id: personId }),
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

export { ActionDenied, newIntentKey }
