import { createRouter, createWebHistory } from 'vue-router'
import DevLogin from '../features/auth/DevLogin.vue'
import TenantPicker from '../features/tenant/TenantPicker.vue'
import AppShell from './AppShell.vue'

const uuid = '[0-9a-fA-F-]{36}'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: DevLogin },
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
          component: () => import('../features/fields/FieldSettingsPage.vue'),
        },
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
