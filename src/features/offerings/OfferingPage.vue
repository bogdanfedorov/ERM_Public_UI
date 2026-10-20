<script setup lang="ts">
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { ArrowLeft, UserPlus } from 'lucide-vue-next'
import { canUpdate } from '../../model/mode'
import { today, weekWindow, zoned } from '../../model/time'
import AttrsList from '../../fields/AttrsList.vue'
import Button from '../../ui/Button.vue'
import Panel from '../../ui/Panel.vue'
import QueryState from '../common/QueryState.vue'
import PersonLink from '../common/PersonLink.vue'
import RuleText from '../common/RuleText.vue'
import StatusBadge from '../common/StatusBadge.vue'
import { enrollmentLook, sessionLook } from '../common/status'
import { useFields, useOffering, useOfferingTitle } from '../common/names'
import { useTenant } from '../tenant/useTenant'
import EnrollDialog from './EnrollDialog.vue'
import type { Schemas } from '../../api/client'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../../api/schema'
import type { UseInfiniteQueryReturnType, InfiniteData } from '@tanstack/vue-query'

const props = defineProps<{
  item: {
    getOffering: (id: Ref<MaybeOptionalInit<paths['/offerings/{offering_id}'], 'get'>>, enabled?: Ref<boolean>) => {
      data: Ref<Schemas['Offering'] | undefined>
      queryKey: ComputedRef<unknown[]>
    }
    getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>, enabled?: Ref<boolean>) => {
      data: Ref<{ items: Schemas['FieldView'][]; next_cursor?: string } | undefined>
      queryKey: ComputedRef<unknown[]>
    }
    getEnrollments: (filter: Ref<MaybeOptionalInit<paths['/enrollments'], 'get'>>, enabled?: Ref<boolean>) => {
      data: Ref<Schemas['EnrollmentPage'] | undefined>
      queryKey: ComputedRef<unknown[]>
    }
    getLessons: (window: Ref<MaybeOptionalInit<paths['/schedule'], 'get'>>, enabled?: Ref<boolean>) => {
      data: Ref<{ items: Schemas['Occurrence'][]; next_cursor?: string } | undefined>
      queryKey: ComputedRef<unknown[]>
    }
  }
  pages: {
    getPeople: () => UseInfiniteQueryReturnType<InfiniteData<Schemas['PersonPage']>, Error> & {
      queryKey: ComputedRef<unknown[]>
    }
  }
  mutate: {
    enroll: (body: MaybeOptionalInit<paths['/offerings/{offering_id}/enrollments'], 'post'>) => Promise<void>
  }
}>()

const { t } = useI18n()
const route = useRoute()
const { id: tenant, q } = useTenant()
const offeringId = computed(() => String(route.params.id))

const offering = useOffering(offeringId)
const fields = useFields('offering')
const title = useOfferingTitle()
const enrollments = useQuery(computed(() => q.value.enrollments({ offering_id: offeringId.value })))

const window = computed(() => {
  const now = today()
  return { from: weekWindow(now).from, to: weekWindow(now.add({ days: 14 })).to }
})
const upcoming = useQuery(
  computed(() => ({
    ...q.value.schedule(window.value),
    select: (page: {
      items: { offering_id: string; start: string; status: 'scheduled' | 'cancelled' | 'rescheduled' }[]
    }) =>
      page.items
        .filter((o) => o.offering_id === offeringId.value && Date.parse(o.start) >= Date.now())
        .slice(0, 8),
  })),
)

const active = computed(() => enrollments.data.value?.items.filter((e) => e.status === 'active') ?? [])
const taken = computed(() => new Set(active.value.map((e) => e.person_id)))
const full = computed(() => !!offering.data.value && active.value.length >= offering.data.value.capacity)
const writable = computed(() => !!offering.data.value && canUpdate(offering.data.value.mode))
const enrolling = ref(false)

const when = (instant: string) =>
  zoned(instant).toLocaleString('uk-UA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<template>
  <RouterLink
    :to="{ name: 'offerings', params: { tenant } }"
    class="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
  >
    <ArrowLeft class="size-4" />{{ t('offering.list') }}
  </RouterLink>

  <QueryState :pending="offering.isPending.value" :error="offering.error.value" :refetch="offering.refetch">
    <template v-if="offering.data.value">
      <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">{{ title(offering.data.value) }}</h1>
          <p class="mt-1 text-sm text-ink-muted">
            {{ offering.data.value.kind }} ·
            {{
              offering.data.value.capacity === 1
                ? t('offering.individual')
                : t('offering.capacityValue', offering.data.value.capacity)
            }}
          </p>
        </div>
        <Button v-if="writable" variant="primary" :disabled="full" @click="enrolling = true">
          <UserPlus />{{ full ? t('offering.full') : t('offering.enroll') }}
        </Button>
      </div>

      <div class="grid gap-gap lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div class="flex flex-col gap-gap">
          <Panel :title="t('offering.participants')">
            <template #actions>
              <span class="tabular text-sm text-ink-muted">
                {{ t('offering.seats', { taken: active.length, capacity: offering.data.value.capacity }) }}
              </span>
            </template>
            <QueryState :pending="enrollments.isPending.value" :error="enrollments.error.value">
              <p v-if="!enrollments.data.value?.items.length" class="px-4 py-3 text-sm text-ink-muted">
                {{ t('offering.noParticipants') }}
              </p>
              <ul v-else class="divide-y divide-line">
                <li
                  v-for="e in enrollments.data.value.items"
                  :key="e.id"
                  class="flex min-h-row items-center justify-between gap-3 px-4 py-2 text-sm"
                >
                  <PersonLink :id="e.person_id" />
                  <StatusBadge :look="enrollmentLook[e.status]" :label="t(`status.enrollment.${e.status}`)" />
                </li>
              </ul>
            </QueryState>
          </Panel>

          <Panel :title="t('offering.details')">
            <QueryState :pending="fields.isPending.value" :error="fields.error.value">
              <AttrsList :fields="fields.data.value?.items ?? []" :attrs="offering.data.value.attrs" />
            </QueryState>
          </Panel>
        </div>

        <div class="flex flex-col gap-gap">
          <Panel :title="t('offering.schedule')">
            <p v-if="!offering.data.value.rules?.length" class="px-4 py-3 text-sm text-ink-muted">
              {{ t('offering.noRules') }}
            </p>
            <ul v-else class="divide-y divide-line text-sm">
              <li v-for="rule in offering.data.value.rules" :key="rule.from" class="px-4 py-2.5">
                <RuleText :rule="rule" />
              </li>
            </ul>
            <QueryState :pending="upcoming.isPending.value" :error="upcoming.error.value" :rows="2">
              <ul
                v-if="upcoming.data.value?.length"
                class="divide-y divide-line border-t border-line text-sm"
              >
                <li
                  v-for="o in upcoming.data.value"
                  :key="o.start"
                  class="flex min-h-row items-center justify-between gap-3 px-4 py-2"
                >
                  <span class="tabular" :class="o.status === 'cancelled' && 'text-ink-faint line-through'">
                    {{ when(o.start) }}
                  </span>
                  <StatusBadge
                    v-if="o.status !== 'scheduled'"
                    :look="sessionLook[o.status]"
                    :label="t(`status.session.${o.status}`)"
                  />
                </li>
              </ul>
            </QueryState>
          </Panel>
        </div>
      </div>

      <EnrollDialog
        v-if="writable"
        v-model:open="enrolling"
        :offering-id="offeringId"
        :title="title(offering.data.value)"
        :taken="taken"
      />
    </template>
  </QueryState>
</template>
