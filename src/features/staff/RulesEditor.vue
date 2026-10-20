<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'
import { resources, setRule, toggleRight, withFields, type Rule, type Scope } from '../../model/access'
import { has, rights } from '../../model/mode'
import RuleFields from './RuleFields.vue'

const props = defineProps<{ personal?: boolean }>()
const rules = defineModel<Rule[]>({ required: true })
const { t } = useI18n()
const open = ref<string>()

const ruleOf = (resource: string) => rules.value.find((r) => r.resource === resource)
const defaultScope = (): Scope => 'all'
const toggle = (resource: string, bit: number) =>
  (rules.value = toggleRight(rules.value, resource, bit, ruleOf(resource)?.scope ?? defaultScope()))
const setScope = (resource: string, scope: Scope) => (rules.value = setRule(rules.value, resource, { scope }))
const replace = (rule: Rule) =>
  (rules.value = rules.value.map((r) => (r.resource === rule.resource ? rule : r)))
</script>

<template>
  <div class="divide-y divide-line rounded-lg border border-line">
    <div v-for="resource in resources" :key="resource" class="px-3 py-2">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span class="min-w-32 flex-1 text-sm">{{ t(`resource.${resource}`) }}</span>
        <span role="group" :aria-label="t(`resource.${resource}`)" class="inline-flex gap-1">
          <button
            v-for="r in rights"
            :key="r.letter"
            type="button"
            :aria-pressed="has(ruleOf(resource)?.mode ?? 0, r.bit)"
            :title="t(`right.${r.letter}`)"
            :aria-label="t(`right.${r.letter}`)"
            class="min-h-8 rounded-md border border-line-strong px-2 text-[13px] text-ink-muted aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
            @click="toggle(resource, r.bit)"
          >
            {{ t(`right.${r.letter}`) }}
          </button>
        </span>
        <select
          v-if="!props.personal && ruleOf(resource)"
          :value="ruleOf(resource)!.scope"
          :aria-label="t('scope.label')"
          class="h-8 rounded-md border border-line-strong bg-paper px-2 text-[13px]"
          @change="setScope(resource, ($event.target as HTMLSelectElement).value as Scope)"
        >
          <option value="all">{{ t('scope.all') }}</option>
          <option value="tagged">{{ t('scope.tagged') }}</option>
        </select>
        <button
          v-if="ruleOf(resource) && withFields.includes(resource)"
          type="button"
          :aria-expanded="open === resource"
          class="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-[13px] text-ink-muted hover:bg-sunken"
          @click="open = open === resource ? undefined : resource"
        >
          {{ ruleOf(resource)!.fields ? t('staff.someFields') : t('staff.allFields') }}
          <ChevronDown class="size-3.5" />
        </button>
      </div>
      <RuleFields v-if="open === resource && ruleOf(resource)" :rule="ruleOf(resource)!" @update="replace" />
    </div>
  </div>
</template>
