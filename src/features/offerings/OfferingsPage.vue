<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ChevronRight, User, Users } from 'lucide-vue-next'
import Button from '../../ui/Button.vue'
import Panel from '../../ui/Panel.vue'
import QueryState from '../common/QueryState.vue'
import RuleText from '../common/RuleText.vue'
import { useOfferingTitle } from '../common/names'
import { useTenant } from '../tenant/useTenant'
import type { Schemas } from '../../api/client'
import type { UseInfiniteQueryReturnType, InfiniteData } from '@tanstack/vue-query'

const props = defineProps<{
  pages: {
    getOfferings: () => UseInfiniteQueryReturnType<InfiniteData<Schemas['OfferingPage']>, Error> & {
      queryKey: ComputedRef<unknown[]>
    }
  }
}>()

const { t } = useI18n()
const { id: tenant, q } = useTenant()
const offerings = useInfiniteQuery(computed(() => q.value.offerings()))
const title = useOfferingTitle()
const all = computed(() => offerings.data.value?.pages.flatMap((p) => p.items) ?? [])
</script>

<template>
  <div class="mb-5">
    <h1 class="text-2xl font-semibold">{{ t('offering.list') }}</h1>
    <p v-if="offerings.data.value" class="text-sm text-ink-muted">{{ t('offering.count', all.length) }}</p>
  </div>

  <Panel>
    <QueryState
      :pending="offerings.isPending.value"
      :error="offerings.error.value"
      :refetch="offerings.refetch"
      :rows="5"
    >
      <p v-if="all.length === 0" class="px-4 py-6 text-center text-sm text-ink-muted">
        {{ t('app.nothingFound') }}
      </p>
      <ul v-else class="divide-y divide-line">
        <li v-for="o in all" :key="o.id" class="relative flex items-center gap-3 px-4 py-3 hover:bg-sunken">
          <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
            <User v-if="o.capacity === 1" class="size-4" />
            <Users v-else class="size-4" />
          </span>
          <div class="min-w-0 flex-1">
            <RouterLink
              :to="{ name: 'offering', params: { tenant, id: o.id } }"
              class="font-medium after:absolute after:inset-0"
            >
              {{ title(o) }}
            </RouterLink>
            <p class="mt-0.5 text-sm text-ink-muted">
              <span>{{ o.kind }}</span>
              <span class="mx-1.5 text-ink-faint">·</span>
              <span>{{
                o.capacity === 1 ? t('offering.individual') : t('offering.capacityValue', o.capacity)
              }}</span>
              <template v-if="o.rules?.length">
                <span class="mx-1.5 text-ink-faint">·</span>
                <RuleText :rule="o.rules[o.rules.length - 1]!" />
              </template>
            </p>
          </div>
          <ChevronRight class="size-4 shrink-0 text-ink-faint" />
        </li>
      </ul>
      <div v-if="offerings.hasNextPage.value" class="border-t border-line p-3 text-center">
        <Button size="sm" :disabled="offerings.isFetchingNextPage.value" @click="offerings.fetchNextPage()">
          {{ t('app.loadMore') }}
        </Button>
      </div>
    </QueryState>
  </Panel>
</template>
