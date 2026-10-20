import { Temporal } from 'temporal-polyfill'

export const TENANT_TIME_ZONE = 'Europe/Kyiv'

export type Window = { from: string; to: string }

export const today = (zone = TENANT_TIME_ZONE) => Temporal.Now.plainDateISO(zone)

export const parseDate = (value: string | undefined) => {
  if (!value) return undefined
  try {
    return Temporal.PlainDate.from(value)
  } catch {
    return undefined
  }
}

const startOf = (day: Temporal.PlainDate, zone: string) => day.toZonedDateTime({ timeZone: zone }).toInstant()

export const dayWindow = (day: Temporal.PlainDate, zone = TENANT_TIME_ZONE): Window => ({
  from: startOf(day, zone).toString(),
  to: startOf(day.add({ days: 1 }), zone).toString(),
})

export const weekStart = (day: Temporal.PlainDate) => day.subtract({ days: day.dayOfWeek - 1 })

export const weekDays = (day: Temporal.PlainDate) => {
  const monday = weekStart(day)
  return Array.from({ length: 7 }, (_, i) => monday.add({ days: i }))
}

export const weekWindow = (day: Temporal.PlainDate, zone = TENANT_TIME_ZONE): Window => {
  const monday = weekStart(day)
  return { from: startOf(monday, zone).toString(), to: startOf(monday.add({ days: 7 }), zone).toString() }
}

export const zoned = (instant: string, zone = TENANT_TIME_ZONE) =>
  Temporal.Instant.from(instant).toZonedDateTimeISO(zone)

export const localDay = (instant: string, zone = TENANT_TIME_ZONE) => zoned(instant, zone).toPlainDate()

export const sameInstant = (a: string, b: string) =>
  Temporal.Instant.compare(Temporal.Instant.from(a), Temporal.Instant.from(b)) === 0

export const isOpenAt = (period: { from: string; to?: string }, at: Temporal.Instant) =>
  Temporal.Instant.compare(Temporal.Instant.from(period.from), at) <= 0 &&
  (!period.to || Temporal.Instant.compare(at, Temporal.Instant.from(period.to)) < 0)
