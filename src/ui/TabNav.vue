<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ label: string; items: readonly { to: RouteLocationRaw; label: string }[] }>()
</script>

<template>
  <nav :aria-label="label" class="mb-5 flex gap-1 overflow-x-auto border-b border-line">
    <RouterLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="-mb-px border-b-2 border-transparent px-3 py-2 text-sm whitespace-nowrap text-ink-muted hover:text-ink"
      exact-active-class="!border-accent !text-ink font-medium"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
