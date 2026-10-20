<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CircleDashed } from 'lucide-vue-next'
import { missingRequired, type Attrs, type Field } from '../model/fields'
import Badge from '../ui/Badge.vue'

const props = defineProps<{ fields: readonly Field[]; attrs: Attrs }>()
const { t } = useI18n()
const count = computed(() => missingRequired(props.fields, props.attrs).length)
</script>

<template>
  <Badge v-if="count > 0" tone="warn" :title="t('field.incompleteHint', count)">
    <CircleDashed />{{ t('field.incomplete') }}
  </Badge>
</template>
