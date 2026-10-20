import { expect, school, test } from './fixtures'

test('lists staff with access and open invitations', async ({ page }) => {
  await page.goto(`/t/${school}/today`)
  await page.getByRole('navigation', { name: 'Головне меню' }).first().getByText('Доступи').click()
  await expect(page.getByRole('heading', { name: 'Співробітники та доступи' })).toBeVisible()
  const active = page.locator('section').filter({ hasText: 'З доступом' })
  await expect(active.locator('li').filter({ hasText: 'Гончар Наталія' })).toContainText('Адміністратори')
  await expect(active.locator('li').filter({ hasText: 'Кравець Петро' })).toContainText('Викладачі')
  const invited = page.locator('section').filter({ hasText: 'Запрошення, що очікують' })
  await expect(invited.locator('li').filter({ hasText: 'Петренко Ірина' })).toContainText(
    'new.teacher@school.test',
  )
})

test('adds an employee and invites them', async ({ page }) => {
  await page.goto(`/t/${school}/staff`)
  await page.getByRole('button', { name: 'Додати співробітника' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Надіслати запрошення' }).click()
  await expect(dialog.getByText(/Заповніть: First name, Last name/)).toBeVisible()
  await dialog.getByLabel('Last name').fill('Мороз')
  await dialog.getByLabel('First name').fill('Олег')
  await dialog.getByLabel('Parent phone').fill('—')
  await dialog.getByLabel('Email або телефон').fill(' Oleg.Moroz@School.test ')
  await dialog.getByRole('checkbox', { name: 'Викладачі' }).check()
  await dialog.getByRole('button', { name: 'Надіслати запрошення' }).dblclick()
  await expect(dialog).toBeHidden()
  const invited = page.locator('section').filter({ hasText: 'Запрошення, що очікують' })
  await expect(invited.locator('li').filter({ hasText: 'Мороз Олег' })).toContainText(
    'oleg.moroz@school.test',
  )
})

test('creates a group with its own rights', async ({ page }) => {
  await page.goto(`/t/${school}/staff`)
  await page.getByRole('link', { name: 'Групи' }).click()
  await expect(page.locator('li').filter({ hasText: 'Адміністратори' })).toContainText('Усі ресурси · RCUD')
  await expect(page.locator('li').filter({ hasText: 'Адміністратори' }).getByRole('button')).toHaveCount(0)
  await page.getByRole('button', { name: 'Створити групу' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog.getByText('Вкажіть назву групи.')).toBeVisible()
  await dialog.getByLabel('Назва').fill('Секретар')
  const people = dialog.getByRole('group', { name: 'Люди' })
  await people.getByRole('button', { name: 'Перегляд' }).click()
  await people.getByRole('button', { name: 'Додавання' }).click()
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('li').filter({ hasText: 'Секретар' })).toContainText('Люди · RC')
})

test('narrows the fields a group sees', async ({ page }) => {
  await page.goto(`/t/${school}/staff/groups`)
  await page.locator('li').filter({ hasText: 'Викладачі' }).getByRole('button', { name: 'Змінити' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Окремі поля' }).first().click()
  await dialog.getByRole('checkbox', { name: 'Parent phone: Бачить' }).uncheck()
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog).toBeHidden()
})

test('gives an account several groups and a personal rule', async ({ page }) => {
  await page.goto(`/t/${school}/staff`)
  const teacher = page.locator('li').filter({ hasText: 'Кравець Петро' })
  await teacher.getByRole('button', { name: 'Змінити доступ' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('checkbox', { name: 'Секретар' }).check()
  await dialog.getByText('Особисті права').click()
  await dialog.getByRole('group', { name: 'Запрошення' }).getByRole('button', { name: 'Перегляд' }).click()
  await dialog.getByRole('button', { name: 'Зберегти' }).click()
  await expect(dialog).toBeHidden()
  await expect(teacher).toContainText('Секретар')
  await expect(teacher).toContainText('1 особисте право')
})

test('keeps the last administrator', async ({ page }) => {
  await page.goto(`/t/${school}/staff`)
  await page
    .locator('li')
    .filter({ hasText: 'Гончар Наталія' })
    .getByRole('button', { name: 'Змінити доступ' })
    .click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Забрати доступ' }).click()
  await dialog.getByRole('button', { name: 'Так, забрати весь доступ' }).click()
  await expect(dialog.getByText('the tenant must keep at least one administrator')).toBeVisible()
})

test('invites an existing person from their page', async ({ page }) => {
  await page.goto(`/t/${school}/people/00000000-0000-4000-8000-00000000b005`)
  const access = page.locator('section').filter({ hasText: 'Доступ до системи' })
  await expect(access).toContainText('Не має входу в систему.')
  await access.getByRole('button', { name: 'Запросити' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Email або телефон').fill('+38 (050) 555-66-77')
  await dialog.getByRole('checkbox', { name: 'Викладачі' }).check()
  await dialog.getByRole('button', { name: 'Надіслати запрошення' }).click()
  await expect(dialog).toBeHidden()
  await expect(access).toContainText('Запрошено: +380505556677')
})
