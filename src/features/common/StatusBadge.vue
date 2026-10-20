<script setup lang="ts">
import type { Component } from 'vue'
import Badge, { type Tone } from '../../ui/Badge.vue'

defineProps<{ look: { tone: Tone; icon: Component }; label: string }>()
</script>

<template>
  <Badge :tone="look.tone"><component :is="look.icon" aria-hidden="true" />{{ label }}</Badge>
</template>
