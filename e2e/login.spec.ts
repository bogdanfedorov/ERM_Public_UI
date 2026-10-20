import { expect, school, test } from './fixtures'

const admin = '00000000-0000-4000-8000-0000000000a1'
const teacher = '00000000-0000-4000-8000-0000000000a2'

test('sends a visitor without an account to the login page and back', async ({ page }) => {
  await page.goto(`/t/${school}/people`)
  await expect(page).toHaveURL(/\/login\?redirect=/)
  await page.getByLabel('ID акаунта').fill(admin)
  await page.getByRole('button', { name: 'Увійти' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${school}/people$`))
  await expect(page.getByText('Коваленко Олена')).toBeVisible()
})

test('rejects an invalid or unknown account id', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('ID акаунта').fill('not-a-uuid')
  await expect(page.getByText('Потрібен UUID')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Увійти' })).toBeDisabled()
  await page.getByLabel('ID акаунта').fill('00000000-0000-4000-8000-0000000000ff')
  await page.getByRole('button', { name: 'Увійти' }).click()
  await expect(page.getByText('Акаунт з таким ID не знайдено.')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('signs out and switches to another account', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('ID акаунта').fill(admin)
  await page.getByRole('button', { name: 'Увійти' }).click()
  await expect(page.getByRole('heading', { name: 'Оберіть школу' })).toBeVisible()
  await page.getByRole('link').filter({ hasText: school }).click()
  await page.getByRole('button', { name: 'Вийти' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await page.goto(`/t/${school}/people`)
  await expect(page).toHaveURL(/\/login\?redirect=/)

  await page.goto('/login')
  await page.getByLabel('ID акаунта').fill(teacher)
  await page.getByRole('button', { name: 'Увійти' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${school}/today$`))
  await page.goto(`/t/${school}/people`)
  await expect(page.getByText('Мельник Софія')).toHaveCount(0)

  await page.getByRole('button', { name: 'Вийти' }).click()
  await page.goto('/login')
  await expect(page.getByRole('button', { name: admin })).toBeVisible()
  await page.getByRole('button', { name: admin }).click()
  await expect(page.getByRole('heading', { name: 'Оберіть школу' })).toBeVisible()
})

test('remembers only accounts that signed in', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('ID акаунта').fill('00000000-0000-4000-8000-0000000000ff')
  await page.getByRole('button', { name: 'Увійти' }).click()
  await expect(page.getByText('Акаунт з таким ID не знайдено.')).toBeVisible()
  await expect(page.getByRole('button', { name: '00000000-0000-4000-8000-0000000000ff' })).toHaveCount(0)
})
