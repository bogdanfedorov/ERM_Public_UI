<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="mb-3 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-ink-muted">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>
