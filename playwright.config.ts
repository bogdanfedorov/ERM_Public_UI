import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:5181'

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/setup.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL, locale: 'uk-UA', timezoneId: 'Europe/Kyiv', trace: 'retain-on-failure' },
  projects: [
    {
      name: 'admin',
      testMatch: 'admin.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a1' },
    },
    {
      name: 'teacher',
      testMatch: 'teacher.spec.ts',
      use: { ...devices['Pixel 7'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a2' },
    },
    { name: 'login', testMatch: 'login.spec.ts', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'staff',
      testMatch: 'staff.spec.ts',
      dependencies: ['admin', 'teacher', 'login'],
      use: { ...devices['Desktop Chrome'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a1' },
    },
    {
      name: 'secretary',
      testMatch: 'secretary.spec.ts',
      dependencies: ['staff'],
      use: { ...devices['Pixel 7'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a2' },
    },
    {
      name: 'invitee',
      testMatch: 'invitee.spec.ts',
      dependencies: ['staff'],
      use: { ...devices['Desktop Chrome'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a3' },
    },
    {
      name: 'fields',
      testMatch: 'fields.spec.ts',
      dependencies: ['secretary', 'invitee'],
      use: { ...devices['Desktop Chrome'] },
      metadata: { account: '00000000-0000-4000-8000-0000000000a1' },
    },
  ],
  webServer: {
    command: 'pnpm exec vite --port 5181 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
  },
})
