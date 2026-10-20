import { createRouter, createWebHistory } from 'vue-router'
import DevLogin from '../features/auth/DevLogin.vue'
import TenantPicker from '../features/tenant/TenantPicker.vue'
import AppShell from './AppShell.vue'
import { queryOptions, useQuery, infiniteQueryOptions, useInfiniteQuery } from '@tanstack/vue-query'
import { createSdk } from '../api/sdk.generated'
import { createApi, unwrap } from '../api/client'
import { computed, type Ref } from 'vue'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../api/schema'

const tenantApis = new Map<string, ReturnType<typeof createSdk>>()
const scopedSdk = (tenantId: string) => {
  let sdk = tenantApis.get(tenantId)
  if (!sdk) {
    sdk = createSdk(createApi(tenantId))
    tenantApis.set(tenantId, sdk)
  }
  return sdk
}

const SDK = createSdk(createApi())

const uuid = '[0-9a-fA-F-]{36}'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: DevLogin
      , props: () => ({
        item: {
          getMe: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['me'],
              queryFn: () => unwrap(SDK.account.me()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        }
      }), },
    { path: '/', name: 'tenants', component: TenantPicker
      , props: () => ({
        item: {
          getMe: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['me'],
              queryFn: () => unwrap(SDK.account.me()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          acceptInvite: (tenantId: string, body: MaybeOptionalInit<paths['/invites/{invite_id}/accept'], 'post'>) => unwrap(scopedSdk(tenantId).invite.accept(body)),
        }
      }), },
    {
      path: `/t/:tenant(${uuid})`,
      component: AppShell,
      children: [
        { path: '', redirect: { name: 'today' } },
        { path: 'today', name: 'today', component: () => import('../features/schedule/TodayPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getLessons: (window: Ref<MaybeOptionalInit<paths['/schedule'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', window.value],
              queryFn: () => unwrap(sdk.schedule.list(window.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        }
      })
      }, },
        { path: 'schedule', name: 'schedule', component: () => import('../features/schedule/WeekPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getLessons: (window: Ref<MaybeOptionalInit<paths['/schedule'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', window.value],
              queryFn: () => unwrap(sdk.schedule.list(window.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        }
      })
      }, },
        { path: 'people', name: 'people', component: () => import('../features/people/PeoplePage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        pages: {
          getPeople: () => {
            const options = infiniteQueryOptions({
              queryKey: ['list'],
              queryFn: ({ pageParam }) => unwrap(sdk.person.list({ params: { query: { cursor: pageParam } } })),
              initialPageParam: undefined as string | undefined,
              getNextPageParam: (page) => page.next_cursor,
              staleTime: 60_000,
            })
            return { ...useInfiniteQuery(options), queryKey: computed(() => options.queryKey) }
          },
        }
      })
      }, },
        {
          path: `people/:id(${uuid})`,
          name: 'person',
          component: () => import('../features/people/PersonPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getPerson: (id: Ref<MaybeOptionalInit<paths['/people/{person_id}'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['get', id.value],
              queryFn: () => unwrap(sdk.person.get(id.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getEnrollments: (filter: Ref<MaybeOptionalInit<paths['/enrollments'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', filter.value],
              queryFn: () => unwrap(sdk.enrollment.list(filter.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getAttendances: (filter: Ref<MaybeOptionalInit<paths['/attendances'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', filter.value],
              queryFn: () => unwrap(sdk.attendance.list(filter.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['fieldList', entity.value],
              queryFn: () => unwrap(sdk.fieldDefinition.fieldList(entity.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getPermits: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['permitList'],
              queryFn: () => unwrap(sdk.access.permitList()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getInvites: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list'],
              queryFn: () => unwrap(sdk.invite.list()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          createPerson: (body: MaybeOptionalInit<paths['/people'], 'post'>) => unwrap(sdk.person.create(body)),
          invite: (body: MaybeOptionalInit<paths['/invites'], 'post'>) => unwrap(sdk.invite.create(body)),
          setPermit: (body: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'patch'>) => unwrap(sdk.person.setPermit(body)),
          revoke: (body: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'delete'>) => unwrap(sdk.person.revoke(body)),
        }
      })
      }, },
        { path: 'staff', name: 'staff', component: () => import('../features/staff/StaffPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getPermits: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['permitList'],
              queryFn: () => unwrap(sdk.access.permitList()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getInvites: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list'],
              queryFn: () => unwrap(sdk.invite.list()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          createPerson: (body: MaybeOptionalInit<paths['/people'], 'post'>) => unwrap(sdk.person.create(body)),
          invite: (body: MaybeOptionalInit<paths['/invites'], 'post'>) => unwrap(sdk.invite.create(body)),
          withdrawInvite: (body: MaybeOptionalInit<paths['/invites/{invite_id}'], 'delete'>) => unwrap(sdk.invite.delete(body)),
          setPermit: (body: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'patch'>) => unwrap(sdk.person.setPermit(body)),
          revoke: (body: MaybeOptionalInit<paths['/people/{person_id}/permit'], 'delete'>) => unwrap(sdk.person.revoke(body)),
        }
      })
      }, },
        { path: 'staff/groups', name: 'groups', component: () => import('../features/staff/GroupsPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getGroups: (enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list'],
              queryFn: () => unwrap(sdk.accessGroup.list()),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          createGroup: (body: MaybeOptionalInit<paths['/groups'], 'post'>) => unwrap(sdk.accessGroup.create(body)),
          updateGroup: (body: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'patch'>) => unwrap(sdk.accessGroup.update(body)),
          deleteGroup: (body: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'delete'>) => unwrap(sdk.accessGroup.delete(body)),
        }
      })
      }, },
        {
          path: 'settings/fields/:entity?',
          name: 'fields',
          component: () => import('../features/fields/FieldSettingsPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['fieldList', entity.value],
              queryFn: () => unwrap(sdk.fieldDefinition.fieldList(entity.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          createField: (body: MaybeOptionalInit<paths['/field_definitions'], 'post'>) => unwrap(sdk.fieldDefinition.create(body)),
          updateField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}'], 'patch'>) => unwrap(sdk.fieldDefinition.update(body)),
          archiveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/archive'], 'post'>) => unwrap(sdk.fieldDefinition.archive(body)),
          restoreField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/restore'], 'post'>) => unwrap(sdk.fieldDefinition.restore(body)),
          moveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/move'], 'post'>) => unwrap(sdk.fieldDefinition.move(body)),
        }
      })
      }, },
        {
          path: 'offerings',
          name: 'offerings',
          component: () => import('../features/offerings/OfferingsPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        pages: {
          getOfferings: () => {
            const options = infiniteQueryOptions({
              queryKey: ['list'],
              queryFn: ({ pageParam }) => unwrap(sdk.offering.list({ params: { query: { cursor: pageParam } } })),
              initialPageParam: undefined as string | undefined,
              getNextPageParam: (page) => page.next_cursor,
              staleTime: 60_000,
            })
            return { ...useInfiniteQuery(options), queryKey: computed(() => options.queryKey) }
          },
        }
      })
      }, },
        {
          path: `offerings/:id(${uuid})`,
          name: 'offering',
          component: () => import('../features/offerings/OfferingPage.vue')
      , props: (route) => {
        const sdk = scopedSdk(String(route.params.tenant))
        return ({
        item: {
          getOffering: (id: Ref<MaybeOptionalInit<paths['/offerings/{offering_id}'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['get', id.value],
              queryFn: () => unwrap(sdk.offering.get(id.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['fieldList', entity.value],
              queryFn: () => unwrap(sdk.fieldDefinition.fieldList(entity.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getEnrollments: (filter: Ref<MaybeOptionalInit<paths['/enrollments'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', filter.value],
              queryFn: () => unwrap(sdk.enrollment.list(filter.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
          getLessons: (window: Ref<MaybeOptionalInit<paths['/schedule'], 'get'>>, enabled?: Ref<boolean>) => {
            const options = computed(() => queryOptions({
              queryKey: ['list', window.value],
              queryFn: () => unwrap(sdk.schedule.list(window.value)),
              enabled: enabled?.value ?? true,
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        pages: {
          getPeople: () => {
            const options = infiniteQueryOptions({
              queryKey: ['list'],
              queryFn: ({ pageParam }) => unwrap(sdk.person.list({ params: { query: { cursor: pageParam } } })),
              initialPageParam: undefined as string | undefined,
              getNextPageParam: (page) => page.next_cursor,
              staleTime: 60_000,
            })
            return { ...useInfiniteQuery(options), queryKey: computed(() => options.queryKey) }
          },
        },
        mutate: {
          enroll: (body: MaybeOptionalInit<paths['/offerings/{offering_id}/enrollments'], 'post'>) => unwrap(sdk.enrollment.create(body)),
        }
      })
      }, },
      ],
    },
    { path: '/:rest(.*)*', redirect: { name: 'tenants' } },
  ],
})
