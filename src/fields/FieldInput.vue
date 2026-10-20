<script setup lang="ts">
import { computed } from 'vue'
import type { Field, FormValue } from '../model/fields'
import CheckField from '../ui/CheckField.vue'
import SelectField from '../ui/SelectField.vue'
import TextField from '../ui/TextField.vue'
import { fieldTitle } from './registry'

const props = defineProps<{ field: Field }>()
const value = defineModel<FormValue>({ default: '' })
const checked = computed({ get: () => value.value === true, set: (v) => (value.value = v) })
const text = computed({
  get: () => (typeof value.value === 'string' ? value.value : ''),
  set: (v) => (value.value = v),
})
const label = computed(() => fieldTitle(props.field))
</script>

<template>
  <CheckField v-if="props.field.type === 'bool'" v-model="checked" :label="label" />
  <SelectField
    v-else-if="props.field.type === 'enum'"
    v-model="text"
    :label="label"
    :required="props.field.required"
    :options="props.field.options.map((o) => ({ value: o, label: o }))"
    blank
  />
  <TextField
    v-else
    v-model="text"
    :label="label"
    :required="props.field.required"
    :type="props.field.type === 'date' ? 'date' : 'text'"
    :inputmode="props.field.type === 'number' ? 'decimal' : undefined"
  />
</template>
