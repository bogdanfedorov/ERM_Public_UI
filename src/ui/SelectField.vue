<script setup lang="ts">
import FormField from './FormField.vue'
import { controlClass } from './controls'

defineProps<{
  label: string
  options: readonly { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
  blank?: boolean
}>()
const value = defineModel<string>({ default: '' })
</script>

<template>
  <FormField v-slot="{ id }" :label="label" :required="required">
    <select :id="id" v-model="value" :disabled="disabled" :class="controlClass">
      <option v-if="blank" value="" />
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </FormField>
</template>
