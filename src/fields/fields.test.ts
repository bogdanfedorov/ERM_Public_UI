import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { messages } from '../app/messages'
import type { Field } from '../model/fields'
import AttrsList from './AttrsList.vue'

const i18n = createI18n({ legacy: false, locale: 'uk', messages })

const field = (over: Partial<Field>): Field => ({
  id: 'f1',
  key: 'k',
  title: '',
  type: 'text',
  required: false,
  options: [],
  index: 'none',
  status: 'active',
  creatable: false,
  writable: false,
  ...over,
})

const render = (fields: Field[], attrs: Record<string, unknown>) =>
  mount(AttrsList, { props: { fields, attrs }, global: { plugins: [i18n] } }).text()

describe('AttrsList', () => {
  it('renders each type through the registry', () => {
    const text = render(
      [
        field({ key: 'first_name' }),
        field({ key: 'lessons', type: 'number' }),
        field({ key: 'consent', type: 'bool' }),
        field({ key: 'grade', type: 'enum', options: ['5-A'] }),
      ],
      { first_name: 'Олена', lessons: 1200, consent: true, grade: '5-A' },
    )
    expect(text).toContain('First name')
    expect(text).toContain('Олена')
    expect(text).toContain((1200).toLocaleString('uk-UA'))
    expect(text).toContain('Так')
    expect(text).toContain('5-A')
  })

  it('marks a missing required field instead of hiding it', () => {
    expect(render([field({ key: 'phone', required: true })], {})).toContain('Не заповнено')
  })

  it('hides an archived field without data', () => {
    expect(render([field({ key: 'old', status: 'archived' })], {})).toContain('Додаткових полів немає')
  })
})
