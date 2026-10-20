<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { newIntentKey } from '../../api/queries'
import FieldInput from '../../fields/FieldInput.vue'
import { fieldTitle } from '../../fields/registry'
import { formFields, formMissing, formPatch, type FormValue } from '../../model/fields'
import { isEmpty, type Permit } from '../../model/access'
import TextField from '../../ui/TextField.vue'
import FormDialog from '../common/FormDialog.vue'
import QueryState from '../common/QueryState.vue'
import { useAction } from '../common/useAction'
import { useFields } from '../common/names'
import { useTenant } from '../tenant/useTenant'
import PermitEditor from './PermitEditor.vue'

const props = defineProps<{ personId?: string; personLabel?: string }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { q } = useTenant()
const fields = useFields('person')

const values = ref<Record<string, FormValue>>({})
const identifier = ref('')
const permit = ref<Permit>({ groups: [], rules: [] })
const createdPerson = ref<string>()
const invalid = ref('')
const intents = ref({ person: newIntentKey(), invite: newIntentKey() })

const inputs = computed(() => (props.personId ? [] : formFields(fields.data.value?.items ?? [])))

watch(open, (isOpen) => {
  if (!isOpen) return
  values.value = {}
  identifier.value = ''
  permit.value = { groups: [], rules: [] }
  createdPerson.value = undefined
  invalid.value = ''
  intents.value = { person: newIntentKey(), invite: newIntentKey() }
  save.reset()
})

watch([identifier, permit], () => {
  intents.value = { ...intents.value, invite: newIntentKey() }
})

const personFor = async (attrs: Record<string, unknown>) => {
  if (props.personId) return props.personId
  if (!createdPerson.value) {
    const result = await q.value.createPerson(attrs, intents.value.person)
    createdPerson.value = (result.diff as { ID: string }).ID
  }
  return createdPerson.value
}

const save = useAction({
  run: async (input: { attrs: Record<string, unknown>; permit: Permit }) => {
    const personId = await personFor(input.attrs)
    await q.value.invite(
      { person_id: personId, identifier: identifier.value, permit: input.permit },
      intents.value.invite,
    )
  },
  invalidate: () => [q.value.key('access'), q.value.key('person')],
  closes: open,
})

const submit = () => {
  if (save.isPending.value) return
  const attrs = formPatch(inputs.value, values.value)
  const missing = formMissing(inputs.value, attrs)
  invalid.value = missing.length
    ? t('staff.missing', { fields: missing.map((f) => fieldTitle(f)).join(', ') })
    : isEmpty(permit.value)
      ? t('staff.pickGroup')
      : ''
  if (!invalid.value) save.mutate({ attrs, permit: permit.value })
}
</script>

<template>
  <FormDialog
    v-model:open="open"
    :title="
      props.personId
        ? t('staff.inviteTitle', { name: props.personLabel || t('person.unnamed') })
        : t('staff.add')
    "
    :description="t('staff.inviteHint')"
    :submit-label="t('staff.send')"
    :pending="save.isPending.value"
    :invalid="invalid"
    :failure="save.error.value"
    @submit="submit"
  >
    <QueryState :pending="fields.isPending.value" :error="fields.error.value">
      <div v-if="inputs.length" class="flex flex-col gap-3">
        <FieldInput v-for="f in inputs" :key="f.key" v-model="values[f.key]" :field="f" />
      </div>

      <TextField
        v-model="identifier"
        :label="t('staff.identifier')"
        :placeholder="t('staff.identifierHint')"
        required
      />

      <PermitEditor v-model="permit" />
    </QueryState>
  </FormDialog>
</template>
