import { expect, school, test } from './fixtures'

test('adds, edits, archives and restores a custom field', async ({ page }) => {
  await page.goto(`/t/${school}/today`)
  await page.getByRole('navigation', { name: 'Головне меню' }).first().getByText('Поля').click()
  await expect(page.getByRole('heading', { name: 'Налаштування полів' })).toBeVisible()
  await expect(page.locator('li').filter({ hasText: 'Parent phone' })).toContainText('Обовʼязкове')

  await page.getByRole('button', { name: 'Додати поле' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog.getByText(/малі латинські літери/)).toBeVisible()
  await dialog.getByLabel('Назва').fill('Рівень')
  await dialog.getByLabel('Ключ').fill('e2e_level')
  await dialog.getByLabel('Тип').selectOption('enum')
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog.getByText('Вкажіть хоча б один варіант.')).toBeVisible()
  await dialog.getByLabel('Варіанти через кому').fill('A, B')
  await dialog.getByRole('button', { name: 'Зберегти' }).dblclick()
  await expect(dialog).toBeHidden()

  const row = page.locator('li').filter({ hasText: 'e2e_level' })
  await expect(row).toContainText('A, B')
  await expect(row).toContainText('Рівень')

  await row.getByRole('button', { name: 'Змінити' }).click()
  await expect(dialog.getByLabel('Ключ')).toBeDisabled()
  await dialog.getByLabel('Варіанти через кому').fill('A')
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(
    dialog.getByText('Наявні варіанти не можна прибирати: записи можуть їх містити.'),
  ).toBeVisible()
  await dialog.getByLabel('Варіанти через кому').fill('A, B, C')
  await dialog.getByLabel('Обовʼязкове').check()
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog).toBeHidden()
  await expect(row).toContainText('A, B, C')
  await expect(row).toContainText('Обовʼязкове')

  const order = () => page.locator('section li').allInnerTexts()
  const position = async () => (await order()).findIndex((t) => t.includes('e2e_level'))
  const last = (await order()).length - 1
  expect(await position()).toBe(last)
  await row.getByRole('button', { name: 'Вище' }).click()
  await expect.poll(position).toBe(last - 1)
  await page.reload()
  await expect.poll(position).toBe(last - 1)
  await row.getByRole('button', { name: 'Нижче' }).click()
  await expect.poll(position).toBe(last)

  await row.getByRole('button', { name: 'Архівувати' }).click()
  await expect(row).toContainText('В архіві')
  await row.getByRole('button', { name: 'Повернути' }).click()
  await expect(row).not.toContainText('В архіві')

  await page
    .getByRole('navigation', { name: 'Налаштування полів' })
    .getByRole('link', { name: 'Послуги', exact: true })
    .click()
  await expect(page.locator('li').filter({ hasText: 'e2e_level' })).toHaveCount(0)
})
