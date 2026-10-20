import type { Entity } from '../../api/queries'
import type { FieldType } from '../../model/fields'

export const entities: readonly Entity[] = ['person', 'offering', 'enrollment', 'attendance', 'session']

export const fieldTypes: readonly FieldType[] = ['text', 'number', 'bool', 'date', 'enum']

export const isEntity = (value: unknown): value is Entity => entities.includes(value as Entity)
