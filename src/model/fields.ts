export type FieldType = 'text' | 'number' | 'bool' | 'date' | 'enum'

export type FieldIndex = 'none' | 'filter' | 'text'

export type Field = {
  id: string
  key: string
  title: string
  type: FieldType
  required: boolean
  options: string[]
  index: FieldIndex
  status: 'active' | 'archived'
  creatable: boolean
  writable: boolean
}

export type Attrs = Record<string, unknown>

const present = (value: unknown) => value !== undefined && value !== null && value !== ''

export const shownFields = (fields: readonly Field[], attrs: Attrs) =>
  fields.filter((f) => f.status === 'active' || present(attrs[f.key]))

export const missingRequired = (fields: readonly Field[], attrs: Attrs) =>
  fields.filter((f) => f.status === 'active' && f.required && !present(attrs[f.key]))

export const listColumns = (fields: readonly Field[]) =>
  fields.filter((f) => f.status === 'active' && f.index !== 'none')

export const titleOf = (fields: readonly Field[], attrs: Attrs) => {
  const field = fields.find((f) => f.status === 'active' && f.type === 'text' && present(attrs[f.key]))
  return field ? String(attrs[field.key]) : undefined
}

export type FormValue = string | boolean

export const formFields = (fields: readonly Field[]) =>
  fields.filter((f) => f.status === 'active' && f.creatable)

export const formPatch = (fields: readonly Field[], values: Record<string, FormValue>): Attrs => {
  const patch: Attrs = {}
  for (const f of formFields(fields)) {
    const value = values[f.key]
    if (f.type === 'bool') {
      if (value === true) patch[f.key] = true
      continue
    }
    const text = typeof value === 'string' ? value.trim() : ''
    if (text === '') continue
    patch[f.key] = f.type === 'number' ? Number(text) : text
  }
  return patch
}

export const formMissing = (fields: readonly Field[], patch: Attrs) =>
  formFields(fields).filter((f) => f.required && !present(patch[f.key]))
