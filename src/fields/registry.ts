import { h, type FunctionalComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Temporal } from 'temporal-polyfill'
import type { FieldType } from '../model/fields'

type Display = FunctionalComponent<{ value: unknown }>

const Empty = () => h('span', { class: 'text-ink-faint' }, '—')

const text: Display = ({ value }) => h('span', String(value))

const number: Display = ({ value }) =>
  h('span', { class: 'tabular' }, typeof value === 'number' ? value.toLocaleString('uk-UA') : String(value))

const bool: Display = ({ value }) => {
  const { t } = useI18n()
  return h('span', value === true ? t('field.yes') : t('field.no'))
}

const date: Display = ({ value }) => {
  try {
    return h(
      'span',
      { class: 'tabular' },
      Temporal.PlainDate.from(String(value)).toLocaleString('uk-UA', { dateStyle: 'medium' }),
    )
  } catch {
    return h('span', String(value))
  }
}

const choice: Display = ({ value }) =>
  h('span', { class: 'rounded bg-sunken px-1.5 py-0.5 text-[13px]' }, String(value))

const registry: Record<FieldType, Display> = { text, number, bool, date, enum: choice }

export const FieldValue: FunctionalComponent<{ type: FieldType; value: unknown }> = ({ type, value }) =>
  value === undefined || value === null || value === '' ? h(Empty) : h(registry[type], { value })

FieldValue.props = ['type', 'value']

export const fieldTitle = (field: { key: string; title?: string }) =>
  field.title?.trim() || fieldLabel(field.key)

export const fieldLabel = (key: string) => {
  const words = key.replace(/[_-]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
