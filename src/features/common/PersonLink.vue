<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Skeleton from '../../ui/Skeleton.vue'
import { useTenant } from '../tenant/useTenant'
import { usePerson } from './names'

const props = defineProps<{ id: string }>()
const { t } = useI18n()
const { id: tenant } = useTenant()
const person = usePerson(() => props.id)
</script>

<template>
  <Skeleton v-if="person.isPending.value" class="inline-block h-4 w-32 align-middle" />
  <span v-else-if="person.isError.value" class="text-ink-faint">{{ t('error.notFound') }}</span>
  <RouterLink
    v-else
    :to="{ name: 'person', params: { tenant, id: props.id } }"
    class="font-medium hover:text-accent hover:underline"
  >
    {{ person.data.value?.label || t('person.unnamed') }}
  </RouterLink>
</template>
