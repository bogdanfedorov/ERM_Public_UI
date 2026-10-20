import { test as base } from '@playwright/test'

export const school = '00000000-0000-4000-8000-000000000001'

export const test = base.extend({
  page: async ({ page, context, baseURL }, use, testInfo) => {
    await page.clock.setFixedTime(new Date('2026-10-15T10:00:00+03:00'))
    const account = testInfo.project.metadata.account as string | undefined
    if (account) {
      const res = await context.request.post(new URL('/api/dev/session', baseURL).href, { data: { account_id: account } })
      if (!res.ok()) throw new Error(`dev sign-in as ${account}: ${res.status()}`)
    }
    await use(page)
  },
})

export { expect } from '@playwright/test'
