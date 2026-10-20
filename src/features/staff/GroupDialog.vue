<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Rule } from '../../model/access'
import Button from '../../ui/Button.vue'
import TextField from '../../ui/TextField.vue'
import FormDialog from '../common/FormDialog.vue'
import { useAction, useIntent } from '../common/useAction'
import { useTenant } from '../tenant/useTenant'
import RulesEditor from './RulesEditor.vue'

const props = defineProps<{ group?: { id: string; name: string; rules: Rule[] } }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { q } = useTenant()
const name = ref('')
const rules = ref<Rule[]>([])
const invalid = ref('')
const intent = useIntent(open, name, rules)

watch(open, (isOpen) => {
  if (!isOpen) return
  name.value = props.group?.name ?? ''
  rules.value = props.group?.rules.map((r) => ({ ...r })) ?? []
  invalid.value = ''
  save.reset()
  remove.reset()
})

const invalidate = () => [q.value.key('access')]

const save = useAction({
  run: () => {
    const body = { name: name.value.trim(), rules: rules.value }
    return props.group
      ? q.value.updateGroup(props.group.id, body, intent.value)
      : q.value.createGroup(body, intent.value)
  },
  invalidate,
  closes: open,
})

const remove = useAction({
  run: () => q.value.deleteGroup(props.group!.id, intent.value),
  invalidate,
  closes: open,
})

const submit = () => {
  if (save.isPending.value) return
  invalid.value = !name.value.trim()
    ? t('groups.needName')
    : rules.value.length === 0
      ? t('groups.needRule')
      : ''
  if (!invalid.value) save.mutate()
}
</script>

<template>
  <FormDialog
    v-model:open="open"
    :title="props.group ? t('groups.editTitle', { name: props.group.name }) : t('groups.add')"
    :description="t('groups.hint')"
    :submit-label="t('staff.save')"
    :pending="save.isPending.value"
    :invalid="invalid"
    :failure="save.error.value ?? remove.error.value"
    @submit="submit"
  >
    <TextField v-model="name" :label="t('groups.name')" required />
    <RulesEditor v-model="rules" />

    <template v-if="props.group" #danger>
      <Button
        type="button"
        variant="ghost"
        class="text-bad"
        :disabled="remove.isPending.value"
        @click="remove.mutate()"
      >
        {{ t('groups.delete') }}
      </Button>
    </template>
  </FormDialog>
</template>
