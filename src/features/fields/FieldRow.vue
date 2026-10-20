<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Archive, ArchiveRestore } from 'lucide-vue-next'
import { newIntentKey } from '../../api/client'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../../api/schema'
import { fieldTitle } from '../../fields/registry'
import type { Field } from '../../model/fields'
import Badge from '../../ui/Badge.vue'
import Button from '../../ui/Button.vue'
import { errorMessage } from '../common/errors'
import { useAction } from '../common/useAction'

type ArchiveInit = MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/archive'], 'post'>
type RestoreInit = MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/restore'], 'post'>

const props = defineProps<{
  field: Field
  archiveField: (body: ArchiveInit) => Promise<unknown>
  restoreField: (body: RestoreInit) => Promise<unknown>
  fieldsQueryKey: unknown[]
}>()
defineEmits<{ edit: [] }>()
const { t } = useI18n()

const toggle = useAction({
  run: () => {
    const params = { path: { field_definition_id: props.field.id } }
    const headers = { 'Idempotency-Key': newIntentKey() }
    return props.field.status === 'active'
      ? props.archiveField({ params, headers })
      : props.restoreField({ params, headers })
  },
  invalidate: () => [props.fieldsQueryKey],
})
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm"
    :class="{ 'opacity-60': field.status === 'archived' }"
  >
    <span class="min-w-0 flex-1 basis-48">
      <span class="font-medium">{{ fieldTitle(field) }}</span>
      <span class="ml-2 text-xs text-ink-faint">{{ field.key }}</span>
      <span v-if="field.options.length" class="block truncate text-xs text-ink-muted">{{
        field.options.join(', ')
      }}</span>
      <span v-if="toggle.error.value" class="block text-xs text-bad">{{
        errorMessage(toggle.error.value, t)
      }}</span>
    </span>
    <span class="flex flex-wrap gap-1.5">
      <Badge>{{ t(`fieldSettings.types.${field.type}`) }}</Badge>
      <Badge v-if="field.required" tone="accent">{{ t('fieldSettings.required') }}</Badge>
      <Badge v-if="field.index !== 'none'">{{ t(`fieldSettings.indexes.${field.index}`) }}</Badge>
      <Badge v-if="field.status === 'archived'" tone="warn">{{ t('fieldSettings.archived') }}</Badge>
    </span>
    <span class="flex gap-1.5">
      <Button v-if="field.status === 'active'" size="sm" @click="$emit('edit')">{{
        t('groups.edit')
      }}</Button>
      <Button size="sm" variant="ghost" :disabled="toggle.isPending.value" @click="toggle.mutate()">
        <component :is="field.status === 'active' ? Archive : ArchiveRestore" />
        {{ field.status === 'active' ? t('fieldSettings.archive') : t('fieldSettings.restore') }}
      </Button>
    </span>
  </div>
</template>
