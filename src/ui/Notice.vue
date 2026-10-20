<script setup lang="ts">
import { CircleAlert, Info } from 'lucide-vue-next'
import { cn } from './cn'

const props = withDefaults(defineProps<{ tone?: 'info' | 'bad'; class?: string }>(), { tone: 'info' })
</script>

<template>
  <div
    role="status"
    :class="
      cn(
        'flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm',
        props.tone === 'bad' ? 'bg-bad-soft text-bad' : 'bg-sunken text-ink-muted',
        props.class,
      )
    "
  >
    <CircleAlert v-if="props.tone === 'bad'" class="mt-0.5 size-4 shrink-0" />
    <Info v-else class="mt-0.5 size-4 shrink-0" />
    <div class="min-w-0"><slot /></div>
  </div>
</template>
