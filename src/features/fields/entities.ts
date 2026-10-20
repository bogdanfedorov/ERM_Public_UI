import type { FieldType } from '../../model/fields'

export const entities = ['person', 'offering', 'enrollment', 'attendance', 'session'] as const

export type Entity = (typeof entities)[number]

export const fieldTypes: readonly FieldType[] = ['text', 'number', 'bool', 'date', 'enum']

export const isEntity = (value: unknown): value is Entity => entities.includes(value as Entity)
