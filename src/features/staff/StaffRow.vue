<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail, ShieldCheck } from 'lucide-vue-next'
import { newIntentKey } from '../../api/queries'
import type { Permit } from '../../model/access'
import Button from '../../ui/Button.vue'
import PersonLink from '../common/PersonLink.vue'
import { errorMessage } from '../common/errors'
import { useAction } from '../common/useAction'
import { usePerson } from '../common/names'
import { useTenant } from '../tenant/useTenant'
import GroupBadges from './GroupBadges.vue'
import PermitDialog from './PermitDialog.vue'

const props = defineProps<{
  personId: string
  permit: Permit
  inviteId?: string
  identifier?: string
}>()
const { t } = useI18n()
const { q } = useTenant()
const person = usePerson(() => props.personId)
const editing = ref(false)
const intent = newIntentKey()

const withdraw = useAction({
  run: () => q.value.withdrawInvite(props.inviteId!, intent),
  invalidate: () => [q.value.key('access')],
})
</script>

<template>
  <li class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
    <span class="flex min-w-0 flex-1 basis-48 items-center gap-2">
      <Mail v-if="props.inviteId" class="size-4 shrink-0 text-ink-faint" :aria-label="t('staff.invited')" />
      <ShieldCheck v-else class="size-4 shrink-0 text-accent" :aria-label="t('staff.active')" />
      <span class="min-w-0">
        <PersonLink :id="props.personId" />
        <span v-if="props.identifier" class="block truncate text-xs text-ink-muted">{{
          props.identifier
        }}</span>
      </span>
    </span>
    <GroupBadges :permit="props.permit" class="flex-1 basis-48" />
    <span class="ml-auto flex items-center gap-2">
      <span v-if="withdraw.error.value" class="text-xs text-bad">{{
        errorMessage(withdraw.error.value, t)
      }}</span>
      <Button v-if="props.inviteId" size="sm" :disabled="withdraw.isPending.value" @click="withdraw.mutate()">
        {{ t('staff.withdraw') }}
      </Button>
      <Button v-else size="sm" @click="editing = true">{{ t('staff.edit') }}</Button>
    </span>
    <PermitDialog
      v-if="!props.inviteId"
      v-model:open="editing"
      :person-id="props.personId"
      :person-label="person.data.value?.label || t('person.unnamed')"
      :permit="props.permit"
    />
  </li>
</template>
