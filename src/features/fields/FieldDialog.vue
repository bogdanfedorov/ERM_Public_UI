<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Entity } from '../../api/queries'
import type { Field, FieldIndex, FieldType } from '../../model/fields'
import CheckField from '../../ui/CheckField.vue'
import SelectField from '../../ui/SelectField.vue'
import TextField from '../../ui/TextField.vue'
import FormDialog from '../common/FormDialog.vue'
import { useAction, useIntent } from '../common/useAction'
import { useTenant } from '../tenant/useTenant'
import { fieldTypes } from './entities'

const props = defineProps<{ entity: Entity; field?: Field }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { q } = useTenant()
const key = ref('')
const title = ref('')
const type = ref<FieldType>('text')
const required = ref(false)
const options = ref('')
const index = ref<FieldIndex>('none')
const invalid = ref('')
const intent = useIntent(open, key, title, type, required, options, index)

watch(open, (isOpen) => {
  if (!isOpen) return
  key.value = props.field?.key ?? ''
  title.value = props.field?.title ?? ''
  type.value = props.field?.type ?? 'text'
  required.value = props.field?.required ?? false
  options.value = props.field?.options.join(', ') ?? ''
  index.value = props.field?.index ?? 'none'
  invalid.value = ''
  save.reset()
})

watch(type, (next) => {
  if (next !== 'text' && index.value === 'text') index.value = 'none'
})

const typeOptions = computed(() =>
  fieldTypes.map((v) => ({ value: v, label: t(`fieldSettings.types.${v}`) })),
)
const indexOptions = computed(() =>
  (['none', 'filter', 'text'] as const)
    .filter((v) => v !== 'text' || type.value === 'text')
    .map((v) => ({ value: v, label: t(`fieldSettings.indexes.${v}`) })),
)
const listed = computed(() =>
  options.value
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
)

const save = useAction({
  run: () => {
    const body = {
      title: title.value.trim(),
      required: required.value,
      index: index.value,
      ...(type.value === 'enum' && { options: listed.value }),
    }
    return props.field
      ? q.value.updateField(props.field.id, body, intent.value)
      : q.value.createField({ ...body, entity: props.entity, key: key.value, type: type.value }, intent.value)
  },
  invalidate: () => [q.value.key('fields')],
  closes: open,
})

const submit = () => {
  if (save.isPending.value) return
  invalid.value = !/^[a-z][a-z0-9_]*$/.test(key.value)
    ? t('fieldSettings.badKey')
    : type.value === 'enum' && listed.value.length === 0
      ? t('fieldSettings.needOptions')
      : props.field?.options.some((o) => !listed.value.includes(o))
        ? t('fieldSettings.optionsOnlyAdd')
        : ''
  if (!invalid.value) save.mutate()
}
</script>

<template>
  <FormDialog
    v-model:open="open"
    :title="
      props.field ? t('fieldSettings.editTitle', { key: props.field.key }) : t('fieldSettings.addTitle')
    "
    :description="t('fieldSettings.hint')"
    :submit-label="t('staff.save')"
    :pending="save.isPending.value"
    :invalid="invalid"
    :failure="save.error.value"
    @submit="submit"
  >
    <TextField
      v-model="title"
      :label="t('fieldSettings.titleLabel')"
      :placeholder="t('fieldSettings.titleHint')"
    />
    <TextField
      v-model="key"
      :label="t('fieldSettings.key')"
      :placeholder="t('fieldSettings.keyHint')"
      :disabled="!!props.field"
      required
    />
    <SelectField
      v-model="type"
      :label="t('fieldSettings.type')"
      :options="typeOptions"
      :disabled="!!props.field"
      required
    />
    <TextField
      v-if="type === 'enum'"
      v-model="options"
      :label="t('fieldSettings.options')"
      :placeholder="t('fieldSettings.optionsHint')"
      required
    />
    <SelectField v-model="index" :label="t('fieldSettings.index')" :options="indexOptions" required />
    <CheckField v-model="required" :label="t('fieldSettings.required')" />
  </FormDialog>
</template>
