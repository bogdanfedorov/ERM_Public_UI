<script setup lang="ts">
import FormField from './FormField.vue'
import { controlClass } from './controls'

defineProps<{
  label: string
  required?: boolean
  disabled?: boolean
  type?: 'text' | 'date'
  inputmode?: 'decimal'
  placeholder?: string
}>()
const value = defineModel<string>({ default: '' })
</script>

<template>
  <FormField v-slot="{ id }" :label="label" :required="required">
    <input
      :id="id"
      v-model="value"
      :type="type ?? 'text'"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      autocomplete="off"
      :class="controlClass"
    />
  </FormField>
</template>
