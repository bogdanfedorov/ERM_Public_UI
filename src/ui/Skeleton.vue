<script setup lang="ts">
import { cn } from './cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('animate-pulse rounded-md bg-sunken', props.class)" />
</template>
