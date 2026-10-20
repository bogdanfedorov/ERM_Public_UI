import { expect, school, test } from './fixtures'

test('the largest right of all groups wins, fields follow the rules', async ({ page }) => {
  await page.goto(`/t/${school}/people`)
  await expect(page.getByText('Мельник Софія')).toBeVisible()
  await page.getByRole('link', { name: 'Коваленко Олена' }).click()
  await expect(page.getByText('Allergies')).toBeVisible()
})
