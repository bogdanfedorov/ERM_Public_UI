import { expect, school, test } from './fixtures'

test('picks a school and lands on today', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Оберіть школу' })).toBeVisible()
  await page.getByRole('link').filter({ hasText: school }).click()
  await expect(page).toHaveURL(new RegExp(`/t/${school}/today$`))
  await expect(page.getByText('3 заняття')).toBeVisible()
})

test('shows attendance with its correction history', async ({ page }) => {
  await page.goto(`/t/${school}/today`)
  const lesson = page.getByRole('article').filter({ hasText: 'Англійська B1' })
  await lesson.getByRole('button', { name: 'Учасники' }).click()
  await expect(lesson.getByText('Відмічено 2 з 2')).toBeVisible()
  await expect(lesson.locator('li').filter({ hasText: 'Коваленко Олена' })).toContainText('Присутній')
  const corrected = lesson.locator('li').filter({ hasText: 'Шевчук Андрій' }).first()
  await expect(corrected).toContainText('Запізнився')
  await corrected.getByText('Історія виправлень').click()
  await expect(corrected).toContainText('Відсутній')
})

test('renders people from field definitions', async ({ page }) => {
  await page.goto(`/t/${school}/people`)
  await expect(page.getByText('9 людей')).toBeVisible()
  await page.getByPlaceholder('Фільтр за іменем').fill('шевч')
  await page.getByRole('link', { name: 'Шевчук Андрій' }).click()
  await expect(page.getByText('Birthday')).toBeVisible()
  await expect(page.getByText('Allergies')).toBeVisible()
  await page.goto(`/t/${school}/people/00000000-0000-4000-8000-00000000b003`)
  await expect(page.getByText('Неповний запис')).toBeVisible()
  await expect(page.getByText('Birthday')).toHaveCount(0)
})

test('enrolls a person once, even on a double click', async ({ page }) => {
  await page.goto(`/t/${school}/offerings/00000000-0000-4000-8000-00000000c002`)
  await expect(page.getByRole('heading', { name: 'Математика, 5 клас' })).toBeVisible()
  await expect(page.getByText('2 з 3')).toBeVisible()
  await page.getByRole('button', { name: 'Записати' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('option', { name: /Коваленко Олена/ })).toBeDisabled()
  await dialog.getByRole('option', { name: /Бондаренко Марія/ }).click()
  await dialog.getByRole('button', { name: 'Записати' }).dblclick()
  await expect(dialog).toBeHidden()
  await expect(page.getByText('3 з 3')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Усі місця зайняті' })).toBeDisabled()
})

test('shows a cancelled lesson next week', async ({ page }) => {
  await page.goto(`/t/${school}/schedule`)
  await page.getByRole('button', { name: 'Наступний тиждень' }).click()
  await expect(page).toHaveURL(/week=2026-10-19/)
  const tuesday = page.getByRole('region', { name: /вівторок, 20 жовтня/ })
  await expect(tuesday.locator('li').filter({ hasText: 'Англійська B1' })).toContainText('Скасовано')
})

test('keeps schools apart in one session', async ({ page }) => {
  await page.goto(`/t/${school}/people`)
  await expect(page.getByText('Коваленко Олена')).toBeVisible()
  await page.goto('/t/00000000-0000-4000-8000-000000000002/people')
  await expect(page.getByText('Учень другої школи')).toBeVisible()
  await expect(page.getByText('Коваленко Олена')).toHaveCount(0)
})
