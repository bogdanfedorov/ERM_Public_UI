<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty, type Permit } from '../../model/access'
import Button from '../../ui/Button.vue'
import Notice from '../../ui/Notice.vue'
import FormDialog from '../common/FormDialog.vue'
import { useAction, useIntent } from '../common/useAction'
import { useTenant } from '../tenant/useTenant'
import PermitEditor from './PermitEditor.vue'

const props = defineProps<{ personId: string; personLabel: string; permit: Permit }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { q } = useTenant()
const draft = ref<Permit>({ groups: [], rules: [] })
const confirming = ref(false)
const intent = useIntent(open, draft, confirming)

watch(open, (isOpen) => {
  if (!isOpen) return
  draft.value = { groups: [...props.permit.groups], rules: props.permit.rules.map((r) => ({ ...r })) }
  confirming.value = false
  save.reset()
})

const save = useAction({
  run: () =>
    confirming.value
      ? q.value.revoke(props.personId, intent.value)
      : q.value.setPermit(props.personId, draft.value, intent.value),
  invalidate: () => [q.value.key('access')],
  closes: open,
})

const submit = () => {
  if (save.isPending.value) return
  if (isEmpty(draft.value) && !confirming.value) {
    confirming.value = true
    return
  }
  save.mutate()
}
</script>

<template>
  <FormDialog
    v-model:open="open"
    :title="t('staff.accessOf', { name: props.personLabel })"
    :description="t('staff.accessHint')"
    :submit-label="t('staff.save')"
    :pending="save.isPending.value"
    :failure="save.error.value"
    :can-submit="!confirming"
    @submit="submit"
  >
    <PermitEditor v-model="draft" />

    <Notice v-if="confirming" tone="bad">{{ t('staff.revokeConfirm', { name: props.personLabel }) }}</Notice>

    <template #danger>
      <Button
        type="button"
        variant="ghost"
        class="text-bad"
        :disabled="save.isPending.value"
        @click="confirming ? save.mutate() : (confirming = true)"
      >
        {{ confirming ? t('staff.revokeYes') : t('staff.revoke') }}
      </Button>
    </template>
  </FormDialog>
</template>
