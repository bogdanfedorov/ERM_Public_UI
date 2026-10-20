<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Entity } from '../../api/queries'
import { fieldTitle } from '../../fields/registry'
import { toggleField, type Rule } from '../../model/access'
import QueryState from '../common/QueryState.vue'
import { useFields } from '../common/names'

const props = defineProps<{ rule: Rule }>()
const emit = defineEmits<{ update: [rule: Rule] }>()
const { t } = useI18n()
const fields = useFields(() => props.rule.resource as Entity)
const items = computed(() => fields.data.value?.items ?? [])
const keys = computed(() => items.value.map((f) => f.key))
const checked = (key: string, side: 'read' | 'write') =>
  !props.rule.fields || props.rule.fields[side].includes(key)
const all = () => emit('update', { ...props.rule, fields: undefined })
</script>

<template>
  <QueryState :pending="fields.isPending.value" :error="fields.error.value" :rows="2">
    <div class="mt-2 rounded-md bg-sunken p-2 text-[13px]">
      <div class="mb-1 flex items-center justify-between gap-2">
        <span class="text-ink-muted">{{ t('staff.fieldsHint') }}</span>
        <button v-if="props.rule.fields" type="button" class="text-accent hover:underline" @click="all">
          {{ t('staff.allFields') }}
        </button>
      </div>
      <table class="w-full">
        <thead class="text-left text-ink-muted">
          <tr>
            <th class="py-1 font-normal" />
            <th class="w-24 py-1 font-normal">{{ t('staff.fieldRead') }}</th>
            <th class="w-24 py-1 font-normal">{{ t('staff.fieldWrite') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="field in items" :key="field.key">
            <td class="py-1">{{ fieldTitle(field) }}</td>
            <td v-for="side in ['read', 'write'] as const" :key="side" class="py-1">
              <input
                type="checkbox"
                class="size-4 accent-accent"
                :aria-label="`${fieldTitle(field)}: ${side === 'read' ? t('staff.fieldRead') : t('staff.fieldWrite')}`"
                :checked="checked(field.key, side)"
                @change="emit('update', toggleField(props.rule, field.key, side, keys))"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </QueryState>
</template>
