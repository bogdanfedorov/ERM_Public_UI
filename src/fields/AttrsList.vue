<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Archive } from 'lucide-vue-next'
import { missingRequired, shownFields, type Attrs, type Field } from '../model/fields'
import Badge from '../ui/Badge.vue'
import { FieldValue, fieldTitle } from './registry'

const props = defineProps<{ fields: readonly Field[]; attrs: Attrs }>()
const { t } = useI18n()

const shown = computed(() => shownFields(props.fields, props.attrs))
const missing = computed(() => new Set(missingRequired(props.fields, props.attrs).map((f) => f.key)))
</script>

<template>
  <p v-if="shown.length === 0" class="px-4 py-3 text-sm text-ink-muted">{{ t('field.none') }}</p>
  <dl v-else class="divide-y divide-line">
    <div
      v-for="field in shown"
      :key="field.key"
      class="grid min-h-row grid-cols-[minmax(7rem,40%)_1fr] items-center gap-3 px-4 py-2 text-sm"
    >
      <dt class="flex items-center gap-1.5 text-ink-muted">
        {{ fieldTitle(field) }}
        <Archive v-if="field.status === 'archived'" class="size-3.5" :aria-label="t('field.archived')" />
      </dt>
      <dd class="min-w-0 break-words">
        <Badge v-if="missing.has(field.key)" tone="warn">{{ t('field.missing') }}</Badge>
        <FieldValue v-else :type="field.type" :value="attrs[field.key]" />
      </dd>
    </div>
  </dl>
</template>
