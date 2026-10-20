import { describe, expect, it } from 'vitest'
import { Temporal } from 'temporal-polyfill'
import { canRead, canUpdate, letters } from './mode'
import { dayWindow, isOpenAt, weekDays, weekWindow, zoned } from './time'
import {
  formMissing,
  formPatch,
  listColumns,
  missingRequired,
  shownFields,
  titleOf,
  type Field,
} from './fields'
import { isEmpty, toggleField, toggleRight, type Rule } from './access'
import { current, history, type AttendanceRecord } from './attendance'
import { describeRule } from './rule'

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

describe('mode', () => {
  it('reads the bitmask', () => {
    expect([canRead(8), canUpdate(8)]).toEqual([true, false])
    expect([canRead(15), canUpdate(15)]).toEqual([true, true])
    expect([canRead(0), canUpdate(0)]).toEqual([false, false])
    expect([letters(12), letters(15), letters(3)]).toEqual(['RC', 'RCUD', 'UD'])
  })
})

describe('time', () => {
  it('builds a day window in the tenant zone, across DST', () => {
    expect(dayWindow(Temporal.PlainDate.from('2026-10-15'))).toEqual({
      from: '2026-10-14T21:00:00Z',
      to: '2026-10-15T21:00:00Z',
    })
    expect(dayWindow(Temporal.PlainDate.from('2026-10-25'))).toEqual({
      from: '2026-10-24T21:00:00Z',
      to: '2026-10-25T22:00:00Z',
    })
  })

  it('starts a week on Monday', () => {
    const days = weekDays(Temporal.PlainDate.from('2026-10-15'))
    expect(days[0]?.toString()).toBe('2026-10-12')
    expect(days[6]?.toString()).toBe('2026-10-18')
    expect(weekWindow(Temporal.PlainDate.from('2026-10-18')).from).toBe('2026-10-11T21:00:00Z')
  })

  it('shows instants in Kyiv time', () => {
    expect(zoned('2026-10-15T15:00:00Z').toPlainTime().toString()).toBe('18:00:00')
  })

  it('treats a period as half-open and open-ended without to', () => {
    const at = Temporal.Instant.from('2026-10-15T10:00:00Z')
    expect(isOpenAt({ from: '2026-09-01T00:00:00Z' }, at)).toBe(true)
    expect(isOpenAt({ from: '2026-09-01T00:00:00Z', to: '2026-10-15T10:00:00Z' }, at)).toBe(false)
    expect(isOpenAt({ from: '2026-10-16T00:00:00Z' }, at)).toBe(false)
  })
})

describe('fields', () => {
  const fields = [
    field({ key: 'name', required: true, index: 'text' }),
    field({ key: 'grade', type: 'enum', options: ['1', '2'], index: 'filter' }),
    field({ key: 'old', status: 'archived' }),
    field({ key: 'phone', required: true, status: 'archived' }),
  ]

  it('shows active fields and archived ones that still hold data', () => {
    expect(shownFields(fields, { old: 'x' }).map((f) => f.key)).toEqual(['name', 'grade', 'old'])
    expect(shownFields(fields, {}).map((f) => f.key)).toEqual(['name', 'grade'])
  })

  it('flags only active required fields as missing', () => {
    expect(missingRequired(fields, {}).map((f) => f.key)).toEqual(['name'])
    expect(missingRequired(fields, { name: 'A' })).toEqual([])
  })

  it('lists indexed active fields as columns', () => {
    expect(listColumns(fields).map((f) => f.key)).toEqual(['name', 'grade'])
  })

  it('takes the first filled text field as a title', () => {
    expect(titleOf(fields, { name: 'English B1' })).toBe('English B1')
    expect(titleOf(fields, {})).toBeUndefined()
  })
})

describe('attendance', () => {
  const r = (id: string, supersedes?: string): AttendanceRecord => ({
    id,
    person_id: 'p',
    start: '2026-10-15T15:00:00Z',
    result: 'present',
    supersedes,
  })

  it('keeps only records nothing supersedes', () => {
    const records = [r('a'), r('b', 'a'), r('c', 'b'), r('x')]
    expect(current(records).map((x) => x.id)).toEqual(['c', 'x'])
  })

  it('walks the correction chain newest first', () => {
    const records = [r('a'), r('b', 'a'), r('c', 'b')]
    expect(history(records, records[2]!).map((x) => x.id)).toEqual(['c', 'b', 'a'])
  })

  it('stops on a cycle', () => {
    const records = [r('a', 'b'), r('b', 'a')]
    expect(history(records, records[0]!).map((x) => x.id)).toEqual(['a', 'b'])
  })
})

describe('rule', () => {
  it('describes a weekly rule in the tenant zone', () => {
    const r = describeRule({ rrule: 'FREQ=WEEKLY;BYDAY=TH,TU', from: '2026-09-01T15:00:00Z' })
    expect(r.kind).toBe('repeat')
    if (r.kind !== 'repeat') return
    expect(r.days).toEqual(['TU', 'TH'])
    expect(r.time.toString()).toBe('18:00:00')
    expect(r.interval).toBe(1)
  })

  it('defaults a weekly rule without BYDAY to the start day', () => {
    const r = describeRule({ rrule: 'FREQ=WEEKLY;INTERVAL=2', from: '2026-09-02T15:00:00Z' })
    expect(r.kind === 'repeat' && r.days).toEqual(['WE'])
    expect(r.kind === 'repeat' && r.interval).toBe(2)
  })

  it('treats COUNT=1 as a one-off lesson', () => {
    expect(describeRule({ rrule: 'FREQ=DAILY;COUNT=1', from: '2026-10-20T08:00:00Z' }).kind).toBe('once')
  })

  it('reads UNTIL as a local date', () => {
    const r = describeRule({ rrule: 'FREQ=DAILY;UNTIL=20261231T215959Z', from: '2026-09-01T06:00:00Z' })
    expect(r.kind === 'repeat' && r.until?.toString()).toBe('2026-12-31')
  })

  it('keeps an unknown rule raw', () => {
    expect(describeRule({ rrule: 'FREQ=YEARLY', from: '2026-09-01T06:00:00Z' }).kind).toBe('raw')
  })
})

describe('rules', () => {
  it('toggles rights and drops a rule left with no rights', () => {
    let rules: Rule[] = toggleRight([], 'person', 8, 'all')
    rules = toggleRight(rules, 'person', 4, 'all')
    expect(rules).toEqual([{ resource: 'person', mode: 12, scope: 'all' }])
    rules = toggleRight(toggleRight(rules, 'person', 8, 'all'), 'person', 4, 'all')
    expect(rules).toEqual([])
    expect(isEmpty({ groups: [], rules })).toBe(true)
  })

  it('narrows fields starting from all of them', () => {
    const rule: Rule = { resource: 'person', mode: 8, scope: 'tagged' }
    const narrowed = toggleField(rule, 'allergies', 'read', ['first_name', 'allergies'])
    expect(narrowed.fields).toEqual({ read: ['first_name'], write: ['first_name', 'allergies'] })
  })
})

describe('form', () => {
  it('builds an attrs patch from the writable active fields only', () => {
    const fields = [
      field({ key: 'name', required: true, creatable: true }),
      field({ key: 'room', type: 'number', creatable: true }),
      field({ key: 'vip', type: 'bool', creatable: true }),
      field({ key: 'secret', writable: true }),
      field({ key: 'old', status: 'archived', creatable: true }),
    ]
    const patch = formPatch(fields, { name: '  Олег ', room: '12', vip: false, secret: 'x', old: 'y' })
    expect(patch).toEqual({ name: 'Олег', room: 12 })
    expect(formMissing(fields, {}).map((f) => f.key)).toEqual(['name'])
  })
})
