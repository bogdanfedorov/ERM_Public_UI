<script setup lang="ts">
import { cn } from './cn'

export type Tone = 'ok' | 'warn' | 'bad' | 'neutral' | 'accent'

const props = withDefaults(defineProps<{ tone?: Tone; class?: string }>(), { tone: 'neutral' })

const tones: Record<Tone, string> = {
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
  neutral: 'bg-neutral-soft text-ink-muted',
  accent: 'bg-accent-soft text-accent',
}
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5',
        tones[props.tone],
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>
