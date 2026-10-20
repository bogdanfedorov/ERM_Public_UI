<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import type { Permit } from '../../model/access'
import Badge from '../../ui/Badge.vue'
import { useTenant } from '../tenant/useTenant'

const props = defineProps<{ permit: Permit }>()
const { t } = useI18n()
const { q } = useTenant()
const groups = useQuery(computed(() => q.value.groups()))
const nameOf = (id: string) => groups.data.value?.items.find((g) => g.id === id)?.name ?? '…'
</script>

<template>
  <span class="flex flex-wrap gap-1.5">
    <Badge v-for="id in props.permit.groups" :key="id" tone="accent">{{ nameOf(id) }}</Badge>
    <Badge v-if="props.permit.rules.length" tone="neutral">
      {{ t('staff.personalCount', props.permit.rules.length) }}
    </Badge>
  </span>
</template>
