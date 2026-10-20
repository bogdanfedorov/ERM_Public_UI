<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label: string; required?: boolean }>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium">
      {{ label }}<span v-if="required" class="text-bad"> *</span>
    </label>
    <slot :id="id" />
  </div>
</template>
