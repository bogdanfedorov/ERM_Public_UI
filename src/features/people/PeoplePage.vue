<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ChevronRight, Search } from 'lucide-vue-next'
import { listColumns } from '../../model/fields'
import { FieldValue, fieldTitle } from '../../fields/registry'
import IncompleteBadge from '../../fields/IncompleteBadge.vue'
import Button from '../../ui/Button.vue'
import Panel from '../../ui/Panel.vue'
import QueryState from '../common/QueryState.vue'
import { useFields } from '../common/names'
import { useTenant } from '../tenant/useTenant'

const { t } = useI18n()
const { id: tenant, q } = useTenant()
const people = useInfiniteQuery(computed(() => q.value.people()))
const fields = useFields('person')

const filter = ref('')
const all = computed(() => people.data.value?.pages.flatMap((p) => p.items) ?? [])
const shown = computed(() => {
  const needle = filter.value.trim().toLocaleLowerCase('uk')
  return needle
    ? all.value.filter((p) => (p.label ?? '').toLocaleLowerCase('uk').includes(needle))
    : all.value
})
const columns = computed(() => listColumns(fields.data.value?.items ?? []).slice(0, 3))
const fieldItems = computed(() => fields.data.value?.items ?? [])
</script>

<template>
  <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">{{ t('person.list') }}</h1>
      <p v-if="people.data.value" class="text-sm text-ink-muted">{{ t('person.count', all.length) }}</p>
    </div>
    <label class="relative w-full sm:w-72">
      <span class="sr-only">{{ t('person.filter') }}</span>
      <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
      <input
        v-model="filter"
        type="search"
        :placeholder="t('person.filter')"
        class="h-row w-full rounded-lg border border-line-strong bg-surface pr-3 pl-9 text-sm placeholder:text-ink-faint"
      />
    </label>
  </div>

  <Panel>
    <QueryState
      :pending="people.isPending.value"
      :error="people.error.value"
      :refetch="people.refetch"
      :rows="6"
    >
      <p v-if="shown.length === 0" class="px-4 py-6 text-center text-sm text-ink-muted">
        {{ t('app.nothingFound') }}
      </p>
      <table v-else class="w-full text-sm">
        <thead class="hidden border-b border-line text-left text-xs text-ink-muted md:table-header-group">
          <tr>
            <th class="px-4 py-2 font-medium">{{ t('person.list') }}</th>
            <th v-for="c in columns" :key="c.key" class="px-4 py-2 font-medium">{{ fieldTitle(c) }}</th>
            <th class="w-8" />
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-for="person in shown" :key="person.id" class="group relative hover:bg-sunken">
            <td class="px-4 py-2.5">
              <RouterLink
                :to="{ name: 'person', params: { tenant, id: person.id } }"
                class="font-medium after:absolute after:inset-0"
              >
                {{ person.label || t('person.unnamed') }}
              </RouterLink>
              <IncompleteBadge :fields="fieldItems" :attrs="person.attrs" class="ml-2" />
            </td>
            <td v-for="c in columns" :key="c.key" class="hidden px-4 py-2.5 md:table-cell">
              <FieldValue :type="c.type" :value="person.attrs[c.key]" />
            </td>
            <td class="w-8 pr-3 text-ink-faint"><ChevronRight class="size-4" /></td>
          </tr>
        </tbody>
      </table>
      <div v-if="people.hasNextPage.value" class="border-t border-line p-3 text-center">
        <Button size="sm" :disabled="people.isFetchingNextPage.value" @click="people.fetchNextPage()">
          {{ t('app.loadMore') }}
        </Button>
      </div>
    </QueryState>
  </Panel>
</template>
