<script setup lang="ts">
import { cn } from './cn'

const props = defineProps<{ title?: string; class?: string }>()
</script>

<template>
  <section :class="cn('rounded-xl border border-line bg-surface', props.class)">
    <header
      v-if="props.title || $slots.actions"
      class="flex min-h-row items-center justify-between gap-3 border-b border-line px-4"
    >
      <h2 class="text-sm font-semibold">{{ props.title }}</h2>
      <slot name="actions" />
    </header>
    <slot />
  </section>
</template>
