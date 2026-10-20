<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from '../../ui/Button.vue'
import Dialog from '../../ui/Dialog.vue'
import Notice from '../../ui/Notice.vue'
import { errorMessage } from './errors'

withDefaults(
  defineProps<{
    title: string
    description?: string
    submitLabel: string
    pending: boolean
    invalid?: string
    failure?: unknown
    canSubmit?: boolean
  }>(),
  { description: undefined, invalid: '', failure: undefined, canSubmit: true },
)
const emit = defineEmits<{ submit: [] }>()
const open = defineModel<boolean>('open', { required: true })
const { t } = useI18n()
</script>

<template>
  <Dialog v-model:open="open" :title="title" :description="description" :close-label="t('app.close')">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="emit('submit')">
      <slot />

      <Notice v-if="invalid" tone="bad">{{ invalid }}</Notice>
      <Notice v-else-if="failure" tone="bad">{{ errorMessage(failure, t) }}</Notice>

      <div class="flex flex-wrap justify-between gap-2">
        <slot name="danger"><span /></slot>
        <span class="flex gap-2">
          <Button type="button" variant="ghost" @click="open = false">{{ t('app.close') }}</Button>
          <Button v-if="canSubmit" type="submit" variant="primary" :disabled="pending">{{
            submitLabel
          }}</Button>
        </span>
      </div>
    </form>
  </Dialog>
</template>
