<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { ArrowLeft } from 'lucide-vue-next'
import { current } from '../../model/attendance'
import { zoned } from '../../model/time'
import AttrsList from '../../fields/AttrsList.vue'
import IncompleteBadge from '../../fields/IncompleteBadge.vue'
import Panel from '../../ui/Panel.vue'
import QueryState from '../common/QueryState.vue'
import OfferingLink from '../common/OfferingLink.vue'
import StatusBadge from '../common/StatusBadge.vue'
import { attendanceLook, enrollmentLook } from '../common/status'
import { useFields, usePerson } from '../common/names'
import { useTenant } from '../tenant/useTenant'
import PersonAccess from '../staff/PersonAccess.vue'

const { t } = useI18n()
const route = useRoute()
const { id: tenant, q, membership } = useTenant()
const personId = computed(() => String(route.params.id))

const person = usePerson(personId)
const fields = useFields('person')
const enrollments = useQuery(computed(() => q.value.enrollments({ person_id: personId.value })))
const attendances = useQuery(computed(() => q.value.attendances({ person_id: personId.value })))

const fieldItems = computed(() => fields.data.value?.items ?? [])
const marks = computed(() =>
  current(attendances.data.value?.items ?? [])
    .slice()
    .sort((a, b) => b.start.localeCompare(a.start))
    .slice(0, 30),
)
const when = (instant: string) =>
  zoned(instant).toLocaleString('uk-UA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<template>
  <RouterLink
    :to="{ name: 'people', params: { tenant } }"
    class="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
  >
    <ArrowLeft class="size-4" />{{ t('person.list') }}
  </RouterLink>

  <QueryState :pending="person.isPending.value" :error="person.error.value" :refetch="person.refetch">
    <template v-if="person.data.value">
      <div class="mb-5 flex flex-wrap items-center gap-3">
        <h1 class="text-2xl font-semibold">{{ person.data.value.label || t('person.unnamed') }}</h1>
        <IncompleteBadge :fields="fieldItems" :attrs="person.data.value.attrs" />
      </div>

      <div class="grid gap-gap lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel :title="t('person.details')">
          <QueryState :pending="fields.isPending.value" :error="fields.error.value">
            <AttrsList :fields="fieldItems" :attrs="person.data.value.attrs" />
          </QueryState>
        </Panel>

        <div class="flex flex-col gap-gap">
          <PersonAccess
            v-if="membership?.admin"
            :person-id="personId"
            :person-label="person.data.value.label || t('person.unnamed')"
          />
          <Panel :title="t('person.enrollments')">
            <QueryState :pending="enrollments.isPending.value" :error="enrollments.error.value">
              <p v-if="!enrollments.data.value?.items.length" class="px-4 py-3 text-sm text-ink-muted">
                {{ t('person.noEnrollments') }}
              </p>
              <ul v-else class="divide-y divide-line">
                <li
                  v-for="e in enrollments.data.value.items"
                  :key="e.id"
                  class="flex min-h-row items-center justify-between gap-3 px-4 py-2 text-sm"
                >
                  <OfferingLink :id="e.offering_id" />
                  <StatusBadge :look="enrollmentLook[e.status]" :label="t(`status.enrollment.${e.status}`)" />
                </li>
              </ul>
            </QueryState>
          </Panel>

          <Panel :title="t('person.attendance')">
            <QueryState :pending="attendances.isPending.value" :error="attendances.error.value">
              <p v-if="marks.length === 0" class="px-4 py-3 text-sm text-ink-muted">
                {{ t('person.noAttendance') }}
              </p>
              <ul v-else class="divide-y divide-line">
                <li
                  v-for="a in marks"
                  :key="a.id"
                  class="flex min-h-row items-center justify-between gap-3 px-4 py-2 text-sm"
                >
                  <span class="min-w-0">
                    <span class="tabular mr-2 text-ink-muted">{{ when(a.start) }}</span>
                    <OfferingLink :id="a.offering_id" />
                  </span>
                  <StatusBadge :look="attendanceLook[a.result]" :label="t(`status.attendance.${a.result}`)" />
                </li>
              </ul>
            </QueryState>
          </Panel>
        </div>
      </div>
    </template>
  </QueryState>
</template>
