<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const button = cva(
  'inline-flex min-h-row shrink-0 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink hover:brightness-110',
        secondary: 'border border-line-strong bg-surface text-ink hover:bg-sunken',
        ghost: 'text-ink-muted hover:bg-sunken hover:text-ink',
      },
      size: {
        md: '',
        sm: 'min-h-8 px-2.5 text-[13px]',
        icon: 'size-row px-0',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

type Variants = VariantProps<typeof button>

const props = withDefaults(
  defineProps<PrimitiveProps & { variant?: Variants['variant']; size?: Variants['size']; class?: string }>(),
  { as: 'button' },
)

const classes = computed(() => cn(button({ variant: props.variant, size: props.size }), props.class))
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="classes">
    <slot />
  </Primitive>
</template>
