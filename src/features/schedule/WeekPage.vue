<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { localDay, parseDate, today, weekDays, weekStart, weekWindow, zoned } from '../../model/time'
import Button from '../../ui/Button.vue'
import QueryState from '../common/QueryState.vue'
import OfferingLink from '../common/OfferingLink.vue'
import StatusBadge from '../common/StatusBadge.vue'
import { sessionLook } from '../common/status'
import { useTenant } from '../tenant/useTenant'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { q } = useTenant()

const now = today()
const anchor = computed(() => weekStart(parseDate(route.query.week as string | undefined) ?? now))
const days = computed(() => weekDays(anchor.value))
const lessons = useQuery(computed(() => q.value.schedule(weekWindow(anchor.value))))

const byDay = computed(() => {
  const groups = new Map(
    days.value.map((d) => [d.toString(), [] as NonNullable<typeof lessons.data.value>['items']]),
  )
  for (const lesson of lessons.data.value?.items ?? [])
    groups.get(localDay(lesson.start).toString())?.push(lesson)
  return groups
})

const go = (weeks: number) =>
  router.replace({ query: { ...route.query, week: anchor.value.add({ weeks }).toString() } })
const goNow = () => router.replace({ query: { ...route.query, week: undefined } })

const range = computed(() => {
  const first = days.value[0]!
  const last = days.value[6]!
  return `${first.toLocaleString('uk-UA', { day: 'numeric', month: 'short' })} – ${last.toLocaleString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`
})
const time = (instant: string) => zoned(instant).toPlainTime().toString({ smallestUnit: 'minute' })
</script>

<template>
  <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">{{ t('nav.schedule') }}</h1>
      <p class="tabular text-sm text-ink-muted">{{ range }}</p>
    </div>
    <div class="flex items-center gap-1.5">
      <Button size="icon" :aria-label="t('schedule.prev')" @click="go(-1)"><ChevronLeft /></Button>
      <Button size="sm" class="min-h-row" @click="goNow">{{ t('schedule.thisWeek') }}</Button>
      <Button size="icon" :aria-label="t('schedule.next')" @click="go(1)"><ChevronRight /></Button>
    </div>
  </div>

  <QueryState
    :pending="lessons.isPending.value"
    :error="lessons.error.value"
    :refetch="lessons.refetch"
    :rows="7"
  >
    <div
      class="grid gap-2 md:grid-cols-7 md:gap-px md:overflow-hidden md:rounded-xl md:border md:border-line md:bg-line"
    >
      <section
        v-for="day in days"
        :key="day.toString()"
        class="rounded-xl border border-line bg-surface md:min-h-64 md:rounded-none md:border-0"
        :aria-label="day.toLocaleString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })"
      >
        <header
          class="flex items-baseline gap-2 border-b border-line px-3 py-2 md:flex-col md:gap-0"
          :class="day.equals(now) && 'bg-accent-soft'"
        >
          <span class="text-xs text-ink-muted uppercase">{{
            day.toLocaleString('uk-UA', { weekday: 'short' })
          }}</span>
          <span class="tabular text-lg font-semibold" :class="day.equals(now) && 'text-accent'">{{
            day.day
          }}</span>
        </header>
        <p v-if="!byDay.get(day.toString())?.length" class="px-3 py-2 text-xs text-ink-faint">
          {{ t('schedule.empty') }}
        </p>
        <ul v-else class="divide-y divide-line">
          <li
            v-for="lesson in byDay.get(day.toString())"
            :key="`${lesson.offering_id}:${lesson.start}`"
            class="px-3 py-2 text-sm"
          >
            <span
              class="tabular block text-xs text-ink-muted"
              :class="lesson.status === 'cancelled' && 'line-through'"
            >
              {{ time(lesson.start) }}
            </span>
            <OfferingLink :id="lesson.offering_id" />
            <div v-if="lesson.status !== 'scheduled'" class="mt-1">
              <StatusBadge :look="sessionLook[lesson.status]" :label="t(`status.session.${lesson.status}`)" />
            </div>
          </li>
        </ul>
      </section>
    </div>
  </QueryState>
</template>
