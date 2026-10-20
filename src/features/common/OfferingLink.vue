<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Skeleton from '../../ui/Skeleton.vue'
import { useTenant } from '../tenant/useTenant'
import { useOffering, useOfferingTitle } from './names'

const props = defineProps<{ id: string }>()
const { t } = useI18n()
const { id: tenant } = useTenant()
const offering = useOffering(() => props.id)
const title = useOfferingTitle()
</script>

<template>
  <Skeleton v-if="offering.isPending.value" class="inline-block h-4 w-32 align-middle" />
  <span v-else-if="!offering.data.value" class="text-ink-faint">{{ t('error.notFound') }}</span>
  <RouterLink
    v-else
    :to="{ name: 'offering', params: { tenant, id: props.id } }"
    class="font-medium hover:text-accent hover:underline"
  >
    {{ title(offering.data.value) }}
  </RouterLink>
</template>
