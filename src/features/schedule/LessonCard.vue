<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Temporal } from 'temporal-polyfill'
import { ChevronDown, History } from 'lucide-vue-next'
import type { Schemas } from '../../api/client'
import { current, history } from '../../model/attendance'
import { isOpenAt, sameInstant, zoned } from '../../model/time'
import QueryState from '../common/QueryState.vue'
import OfferingLink from '../common/OfferingLink.vue'
import PersonLink from '../common/PersonLink.vue'
import StatusBadge from '../common/StatusBadge.vue'
import { attendanceLook, sessionLook } from '../common/status'
import { useTenant } from '../tenant/useTenant'

const props = defineProps<{ lesson: Schemas['Occurrence'] }>()
const { t } = useI18n()
const { q } = useTenant()
const open = ref(false)

const filter = computed(() => ({ offering_id: props.lesson.offering_id }))
const enrollments = useQuery(computed(() => ({ ...q.value.enrollments(filter.value), enabled: open.value })))
const attendances = useQuery(computed(() => ({ ...q.value.attendances(filter.value), enabled: open.value })))

const at = computed(() => Temporal.Instant.from(props.lesson.start))
const time = computed(() => zoned(props.lesson.start).toPlainTime().toString({ smallestUnit: 'minute' }))

const records = computed(() =>
  (attendances.data.value?.items ?? []).filter((a) => sameInstant(a.start, props.lesson.start)),
)

const rows = computed(() => {
  const marks = new Map(current(records.value).map((a) => [a.person_id, a]))
  return (enrollments.data.value?.items ?? [])
    .filter((e) => e.status === 'active' && isOpenAt(e.period, at.value))
    .map((e) => {
      const mark = marks.get(e.person_id)
      return { person: e.person_id, mark, chain: mark ? history(records.value, mark) : [] }
    })
})

const marked = computed(() => rows.value.filter((r) => r.mark).length)
const cancelled = computed(() => props.lesson.status === 'cancelled')
</script>

<template>
  <article class="rounded-xl border border-line bg-surface" :class="cancelled && 'opacity-75'">
    <div class="flex items-center gap-3 px-4 py-3">
      <span
        class="tabular w-12 shrink-0 text-lg font-semibold"
        :class="cancelled && 'text-ink-faint line-through'"
      >
        {{ time }}
      </span>
      <div class="min-w-0 flex-1">
        <OfferingLink :id="lesson.offering_id" />
        <div v-if="lesson.status !== 'scheduled'" class="mt-1">
          <StatusBadge :look="sessionLook[lesson.status]" :label="t(`status.session.${lesson.status}`)" />
        </div>
      </div>
      <button
        class="grid size-10 shrink-0 place-items-center rounded-lg text-ink-muted hover:bg-sunken hover:text-ink"
        :aria-expanded="open"
        :aria-label="t('schedule.participants')"
        @click="open = !open"
      >
        <ChevronDown class="size-5 transition-transform" :class="open && 'rotate-180'" />
      </button>
    </div>

    <div v-if="open" class="border-t border-line">
      <QueryState
        :pending="enrollments.isPending.value || attendances.isPending.value"
        :error="enrollments.error.value ?? attendances.error.value"
        :rows="2"
      >
        <p v-if="rows.length === 0" class="px-4 py-3 text-sm text-ink-muted">
          {{ t('schedule.noParticipants') }}
        </p>
        <template v-else>
          <p class="px-4 pt-2.5 text-xs text-ink-muted">
            {{ t('schedule.marked', { n: marked, total: rows.length }) }}
          </p>
          <ul class="divide-y divide-line">
            <li v-for="row in rows" :key="row.person" class="px-4 py-2 text-sm">
              <div class="flex min-h-row items-center justify-between gap-3">
                <PersonLink :id="row.person" />
                <StatusBadge
                  :look="attendanceLook[row.mark?.result ?? 'none']"
                  :label="t(`status.attendance.${row.mark?.result ?? 'none'}`)"
                />
              </div>
              <details v-if="row.chain.length > 1" class="pb-1 text-xs text-ink-muted">
                <summary class="inline-flex cursor-pointer items-center gap-1">
                  <History class="size-3.5" />{{ t('schedule.history') }}
                </summary>
                <ol class="mt-1 ml-5 list-decimal">
                  <li v-for="a in row.chain.slice(1)" :key="a.id" class="line-through">
                    {{ t(`status.attendance.${a.result}`) }}
                  </li>
                </ol>
              </details>
            </li>
          </ul>
        </template>
      </QueryState>
    </div>
  </article>
</template>
