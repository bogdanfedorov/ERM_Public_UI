<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Notice from '../../ui/Notice.vue'
import { useTenant } from '../tenant/useTenant'

defineProps<{ message: string }>()
const { t } = useI18n()
const { admin } = useTenant()
</script>

<template>
  <slot v-if="admin" />
  <Notice v-else tone="bad">{{ message || t('error.forbidden') }}</Notice>
</template>
