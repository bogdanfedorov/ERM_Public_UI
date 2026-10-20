import { Temporal } from 'temporal-polyfill'
import { TENANT_TIME_ZONE } from './time'

export type Weekday = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export type RuleSummary =
  | { kind: 'once'; at: Temporal.ZonedDateTime }
  | {
      kind: 'repeat'
      freq: 'DAILY' | 'WEEKLY' | 'MONTHLY'
      interval: number
      days: Weekday[]
      time: Temporal.PlainTime
      from: Temporal.PlainDate
      count?: number
      until?: Temporal.PlainDate
    }
  | { kind: 'raw'; rrule: string }

const weekdays: Weekday[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

const parts = (rrule: string) =>
  new Map(
    rrule
      .replace(/^RRULE:/i, '')
      .split(';')
      .map((part) => part.split('=') as [string, string])
      .filter(([k, v]) => k && v !== undefined)
      .map(([k, v]) => [k.toUpperCase(), v.toUpperCase()]),
  )

const untilDate = (value: string | undefined, zone: string) => {
  const m = value?.match(/^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/)
  if (!m) return undefined
  const date = { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) }
  if (!m[4]) return Temporal.PlainDate.from(date)
  const instant = Temporal.Instant.from(`${m[1]}-${m[2]}-${m[3]}T${m[5]}:${m[6]}:${m[7]}Z`)
  return instant.toZonedDateTimeISO(zone).toPlainDate()
}

export const describeRule = (rule: { rrule: string; from: string }, zone = TENANT_TIME_ZONE): RuleSummary => {
  const p = parts(rule.rrule)
  const start = Temporal.Instant.from(rule.from).toZonedDateTimeISO(zone)
  const freq = p.get('FREQ')
  const count = p.has('COUNT') ? Number(p.get('COUNT')) : undefined

  if (count === 1) return { kind: 'once', at: start }
  if (freq !== 'DAILY' && freq !== 'WEEKLY' && freq !== 'MONTHLY') return { kind: 'raw', rrule: rule.rrule }

  const byDay = (p.get('BYDAY') ?? '').split(',').filter((d): d is Weekday => weekdays.includes(d as Weekday))
  const days = freq === 'WEEKLY' && byDay.length === 0 ? [weekdays[start.dayOfWeek - 1]!] : byDay

  return {
    kind: 'repeat',
    freq,
    interval: Number(p.get('INTERVAL') ?? 1) || 1,
    days: weekdays.filter((d) => days.includes(d)),
    time: start.toPlainTime(),
    from: start.toPlainDate(),
    count,
    until: untilDate(p.get('UNTIL'), zone),
  }
}
