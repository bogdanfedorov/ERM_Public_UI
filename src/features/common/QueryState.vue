<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Notice from '../../ui/Notice.vue'
import Button from '../../ui/Button.vue'
import Skeleton from '../../ui/Skeleton.vue'
import { errorMessage } from './errors'

withDefaults(defineProps<{ pending: boolean; error: unknown; rows?: number; refetch?: () => unknown }>(), {
  rows: 3,
  refetch: undefined,
})
const { t } = useI18n()
</script>

<template>
  <div v-if="pending" class="space-y-2 p-4" :aria-label="t('app.loading')" aria-busy="true">
    <Skeleton v-for="i in rows" :key="i" class="h-row" />
  </div>
  <div v-else-if="error" class="p-4">
    <Notice tone="bad">
      <p>{{ errorMessage(error, t) }}</p>
      <Button v-if="refetch" size="sm" class="mt-2" @click="refetch()">{{ t('app.retry') }}</Button>
    </Notice>
  </div>
  <slot v-else />
</template>
