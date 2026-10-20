import { has } from './mode'

export type Scope = 'all' | 'tagged'

export type Rule = {
  resource: string
  mode: number
  scope: Scope
  fields?: { read: string[]; write: string[] }
}

export type Permit = { groups: string[]; rules: Rule[] }

export const resources = [
  'person',
  'offering',
  'session',
  'enrollment',
  'attendance',
  'invite',
  'access_group',
] as const

export const withFields: readonly string[] = ['person', 'offering', 'session', 'enrollment', 'attendance']

export const toggleRight = (rules: readonly Rule[], resource: string, bit: number, scope: Scope): Rule[] => {
  const rule = rules.find((r) => r.resource === resource)
  if (!rule) return [...rules, { resource, mode: bit, scope }]
  const mode = has(rule.mode, bit) ? rule.mode & ~bit : rule.mode | bit
  return mode === 0 ? rules.filter((r) => r !== rule) : rules.map((r) => (r === rule ? { ...r, mode } : r))
}

export const setRule = (rules: readonly Rule[], resource: string, patch: Partial<Rule>): Rule[] =>
  rules.map((r) => (r.resource === resource ? { ...r, ...patch } : r))

export const toggleField = (
  rule: Rule,
  key: string,
  side: 'read' | 'write',
  all: readonly string[],
): Rule => {
  const fields = rule.fields ?? { read: [...all], write: [...all] }
  const list = fields[side].includes(key) ? fields[side].filter((k) => k !== key) : [...fields[side], key]
  return { ...rule, fields: { ...fields, [side]: list } }
}

export const isEmpty = (permit: Permit) => permit.groups.length === 0 && permit.rules.length === 0
