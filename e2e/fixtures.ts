import { test as base } from '@playwright/test'

export const school = '00000000-0000-4000-8000-000000000001'

export const test = base.extend({
  page: async ({ page, context, baseURL }, use, testInfo) => {
    await page.clock.setFixedTime(new Date('2026-10-15T10:00:00+03:00'))
    const account = testInfo.project.metadata.account as string | undefined
    if (account) await context.addCookies([{ name: 'erm_dev_account', value: account, url: baseURL! }])
    await use(page)
  },
})

export { expect } from '@playwright/test'
