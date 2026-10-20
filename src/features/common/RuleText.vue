<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { describeRule } from '../../model/rule'

const props = defineProps<{ rule: { rrule: string; from: string } }>()
const { t } = useI18n()

const time = (value: { toString: (o: { smallestUnit: 'minute' }) => string }) =>
  value.toString({ smallestUnit: 'minute' })
const date = (value: { toLocaleString: (l: string, o: Intl.DateTimeFormatOptions) => string }) =>
  value.toLocaleString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })

const text = computed(() => {
  const r = describeRule(props.rule)
  if (r.kind === 'raw') return t('rule.raw', { rrule: r.rrule })
  if (r.kind === 'once')
    return t('rule.once', { date: date(r.at.toPlainDate()), time: time(r.at.toPlainTime()) })
  const parts = [r.interval === 1 ? t(`rule.every.${r.freq}`) : t(`rule.everyN.${r.freq}`, r.interval)]
  if (r.days.length) parts.push(r.days.map((d) => t(`rule.weekday.${d}`)).join(', '))
  parts.push(t('rule.at', { time: time(r.time) }))
  parts.push(t('rule.from', { date: date(r.from) }))
  if (r.until) parts.push(t('rule.until', { date: date(r.until) }))
  if (r.count) parts.push(`(${t('rule.count', r.count)})`)
  return parts.join(' ')
})
</script>

<template>
  <span>{{ text }}</span>
</template>
