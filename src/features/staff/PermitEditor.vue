<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import type { Permit } from '../../model/access'
import { useTenant } from '../tenant/useTenant'
import RulesEditor from './RulesEditor.vue'

const permit = defineModel<Permit>({ required: true })
const { t } = useI18n()
const { q } = useTenant()
const groups = useQuery(computed(() => q.value.groups()))

const toggleGroup = (id: string) => {
  const has = permit.value.groups.includes(id)
  permit.value = {
    ...permit.value,
    groups: has ? permit.value.groups.filter((g) => g !== id) : [...permit.value.groups, id],
  }
}
const rules = computed({
  get: () => permit.value.rules,
  set: (rules) => (permit.value = { ...permit.value, rules }),
})
</script>

<template>
  <fieldset class="flex flex-col gap-2">
    <legend class="mb-1 text-sm font-medium">{{ t('staff.groups') }}</legend>
    <label
      v-for="g in groups.data.value?.items ?? []"
      :key="g.id"
      class="flex min-h-row items-center gap-2.5 rounded-lg border border-line px-3 text-sm"
    >
      <input
        type="checkbox"
        class="size-4 accent-accent"
        :checked="permit.groups.includes(g.id)"
        @change="toggleGroup(g.id)"
      />
      {{ g.name }}
    </label>
  </fieldset>
  <details class="group" :open="permit.rules.length > 0">
    <summary class="cursor-pointer text-sm font-medium">{{ t('staff.personalRules') }}</summary>
    <p class="mt-1 mb-2 text-xs text-ink-muted">{{ t('staff.personalHint') }}</p>
    <RulesEditor v-model="rules" personal />
  </details>
</template>
