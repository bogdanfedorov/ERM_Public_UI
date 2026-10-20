<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import Button from '../../ui/Button.vue'
import Panel from '../../ui/Panel.vue'
import QueryState from '../common/QueryState.vue'
import { useTenant } from '../tenant/useTenant'
import GroupBadges from './GroupBadges.vue'
import InviteDialog from './InviteDialog.vue'
import PermitDialog from './PermitDialog.vue'

const props = defineProps<{ personId: string; personLabel: string }>()
const { t } = useI18n()
const { q } = useTenant()
const permits = useQuery(computed(() => q.value.permits()))
const invites = useQuery(computed(() => q.value.invites()))
const access = computed(() => permits.data.value?.items.find((a) => a.person_id === props.personId))
const invite = computed(() => invites.data.value?.items.find((i) => i.person_id === props.personId))
const inviting = ref(false)
const editing = ref(false)
</script>

<template>
  <Panel :title="t('staff.access')">
    <QueryState
      :pending="permits.isPending.value || invites.isPending.value"
      :error="permits.error.value ?? invites.error.value"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
        <GroupBadges v-if="access" :permit="{ groups: access.groups, rules: access.rules }" />
        <span v-else-if="invite" class="text-ink-muted">{{
          t('staff.invitedAs', { identifier: invite.identifier })
        }}</span>
        <span v-else class="text-ink-muted">{{ t('staff.noAccount') }}</span>
        <Button v-if="access" size="sm" @click="editing = true">{{ t('staff.edit') }}</Button>
        <Button v-else-if="!invite" size="sm" @click="inviting = true">{{ t('staff.invite') }}</Button>
      </div>
    </QueryState>
    <InviteDialog v-model:open="inviting" :person-id="props.personId" :person-label="props.personLabel" />
    <PermitDialog
      v-if="access"
      v-model:open="editing"
      :person-id="props.personId"
      :person-label="props.personLabel"
      :permit="{ groups: access.groups, rules: access.rules }"
    />
  </Panel>
</template>
