import { expect, school, test } from './fixtures'

test('a teacher with one school skips the picker', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(new RegExp(`/t/${school}/today$`))
  await expect(page.getByText('2 заняття')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Головне меню' }).getByText('Сьогодні')).toBeVisible()
})

test('a teacher does not see restricted fields or untagged people', async ({ page }) => {
  await page.goto(`/t/${school}/people`)
  await expect(page.getByText('5 людей')).toBeVisible()
  await expect(page.getByText('Мельник Софія')).toHaveCount(0)
  await page.getByRole('link', { name: 'Коваленко Олена' }).click()
  await expect(page.getByText('Parent phone')).toBeVisible()
  await expect(page.getByText('Allergies')).toHaveCount(0)
})
