import { expect, school, test } from './fixtures'

test('accepts an invitation and lands in the school', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Вас запросили працювати в школі.')).toBeVisible()
  await page.getByRole('button', { name: 'Прийняти' }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${school}/today$`))
  await expect(
    page.getByRole('navigation', { name: 'Головне меню' }).first().getByText('Доступи'),
  ).toHaveCount(0)
})
