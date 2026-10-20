<script setup lang="ts" generic="T extends { id: string }">
import { ref } from 'vue'
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-vue-next'
import { dropAfter, neighbour } from './sortable'
import Button from './Button.vue'

const props = defineProps<{
  items: readonly T[]
  labels: { handle: string; up: string; down: string }
  disabled?: boolean
}>()
const emit = defineEmits<{ move: [move: { id: string; afterId?: string }] }>()

const dragging = ref<string>()
const over = ref<string>()

const step = (id: string, direction: -1 | 1) => {
  const target = neighbour(props.items, id, direction)
  if (target) emit('move', { id, ...target })
}

const drop = (overId: string) => {
  const id = dragging.value
  dragging.value = over.value = undefined
  const target = id ? dropAfter(props.items, id, overId) : undefined
  if (id && target) emit('move', { id, ...target })
}
</script>

<template>
  <ul class="divide-y divide-line">
    <li
      v-for="(item, i) in items"
      :key="item.id"
      class="flex items-center gap-1 pl-2"
      :class="{
        'opacity-50': dragging === item.id,
        'bg-accent-soft': over === item.id && dragging !== item.id,
      }"
      @dragover.prevent="over = item.id"
      @dragleave="over = over === item.id ? undefined : over"
      @drop.prevent="drop(item.id)"
    >
      <span
        role="presentation"
        :draggable="!disabled"
        class="grid size-8 shrink-0 cursor-grab place-items-center text-ink-faint active:cursor-grabbing"
        :title="labels.handle"
        @dragstart="dragging = item.id"
        @dragend="dragging = over = undefined"
      >
        <GripVertical class="size-4" />
      </span>
      <div class="min-w-0 flex-1"><slot :item="item" /></div>
      <span class="flex shrink-0 pr-2">
        <Button
          size="sm"
          variant="ghost"
          class="px-1.5"
          :disabled="disabled || i === 0"
          :aria-label="labels.up"
          :title="labels.up"
          @click="step(item.id, -1)"
        >
          <ArrowUp />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          class="px-1.5"
          :disabled="disabled || i === items.length - 1"
          :aria-label="labels.down"
          :title="labels.down"
          @click="step(item.id, 1)"
        >
          <ArrowDown />
        </Button>
      </span>
    </li>
  </ul>
</template>
