import { createRouter, createWebHistory } from 'vue-router'
import DevLogin from '../features/auth/DevLogin.vue'
import TenantPicker from '../features/tenant/TenantPicker.vue'
import AppShell from './AppShell.vue'
import { queryOptions, useQuery } from '@tanstack/vue-query'
import { createSdk } from '../api/sdk.generated'
import { createApi, unwrap } from '../api/client'
import { computed, type Ref } from 'vue'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../api/schema'

const SDK = createSdk(createApi())

const uuid = '[0-9a-fA-F-]{36}'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: DevLogin
      , props: () => ({
        api: {
          getMe: () => {
            const options = computed(() => queryOptions({
              queryKey: ['me'],
              queryFn: () => unwrap(SDK.account.me()),
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        }
      }), },
    { path: '/', name: 'tenants', component: TenantPicker },
    {
      path: `/t/:tenant(${uuid})`,
      component: AppShell,
      children: [
        { path: '', redirect: { name: 'today' } },
        { path: 'today', name: 'today', component: () => import('../features/schedule/TodayPage.vue') },
        { path: 'schedule', name: 'schedule', component: () => import('../features/schedule/WeekPage.vue') },
        { path: 'people', name: 'people', component: () => import('../features/people/PeoplePage.vue') },
        {
          path: `people/:id(${uuid})`,
          name: 'person',
          component: () => import('../features/people/PersonPage.vue'),
        },
        { path: 'staff', name: 'staff', component: () => import('../features/staff/StaffPage.vue') },
        { path: 'staff/groups', name: 'groups', component: () => import('../features/staff/GroupsPage.vue') },
        {
          path: 'settings/fields/:entity?',
          name: 'fields',
          component: () => import('../features/fields/FieldSettingsPage.vue')
      , props: () => ({
        api: {
          getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>) => {
            const options = computed(() => queryOptions({
              queryKey: ['fieldList', entity.value],
              queryFn: () => unwrap(SDK.fieldDefinition.fieldList(entity.value)),
              staleTime: 60_000,
            }))
            return { ...useQuery(options), queryKey: computed(() => options.value.queryKey) }
          },
        },
        mutate: {
          createField: (body: MaybeOptionalInit<paths['/field_definitions'], 'post'>) => unwrap(SDK.fieldDefinition.create(body)),
          updateField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}'], 'patch'>) => unwrap(SDK.fieldDefinition.update(body)),
          archiveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/archive'], 'post'>) => unwrap(SDK.fieldDefinition.archive(body)),
          restoreField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/restore'], 'post'>) => unwrap(SDK.fieldDefinition.restore(body)),
          moveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/move'], 'post'>) => unwrap(SDK.fieldDefinition.move(body)),
        }
      }), },
        {
          path: 'offerings',
          name: 'offerings',
          component: () => import('../features/offerings/OfferingsPage.vue'),
        },
        {
          path: `offerings/:id(${uuid})`,
          name: 'offering',
          component: () => import('../features/offerings/OfferingPage.vue'),
        },
      ],
    },
    { path: '/:rest(.*)*', redirect: { name: 'tenants' } },
  ],
})
