<script setup lang="ts">
defineProps<{ label: string; disabled?: boolean }>()
const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="flex min-h-row items-center gap-2.5 text-sm">
    <input v-model="checked" type="checkbox" :disabled="disabled" class="size-4 accent-accent" />
    {{ label }}
  </label>
</template>
