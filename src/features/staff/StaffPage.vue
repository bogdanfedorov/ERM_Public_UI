<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { UserPlus } from 'lucide-vue-next'
import Button from '../../ui/Button.vue'
import PageHeader from '../../ui/PageHeader.vue'
import Panel from '../../ui/Panel.vue'
import AdminGate from '../common/AdminGate.vue'
import QueryState from '../common/QueryState.vue'
import { useTenant } from '../tenant/useTenant'
import InviteDialog from './InviteDialog.vue'
import StaffRow from './StaffRow.vue'
import StaffTabs from './StaffTabs.vue'

const { t } = useI18n()
const { q, admin } = useTenant()
const permits = useQuery(computed(() => ({ ...q.value.permits(), enabled: admin.value })))
const invites = useQuery(computed(() => ({ ...q.value.invites(), enabled: admin.value })))
const adding = ref(false)

const active = computed(() => permits.data.value?.items ?? [])
const open = computed(() => invites.data.value?.items ?? [])
</script>

<template>
  <AdminGate :message="t('staff.adminsOnly')">
    <PageHeader :title="t('staff.title')" :subtitle="t('staff.subtitle')">
      <Button variant="primary" @click="adding = true"><UserPlus />{{ t('staff.add') }}</Button>
    </PageHeader>

    <StaffTabs />

    <div class="flex flex-col gap-gap">
      <Panel :title="t('staff.withAccess')">
        <QueryState
          :pending="permits.isPending.value"
          :error="permits.error.value"
          :refetch="permits.refetch"
        >
          <ul class="divide-y divide-line">
            <StaffRow
              v-for="a in active"
              :key="a.person_id"
              :person-id="a.person_id"
              :permit="{ groups: a.groups, rules: a.rules }"
            />
          </ul>
        </QueryState>
      </Panel>

      <Panel :title="t('staff.invitations')">
        <QueryState
          :pending="invites.isPending.value"
          :error="invites.error.value"
          :refetch="invites.refetch"
        >
          <p v-if="open.length === 0" class="px-4 py-3 text-sm text-ink-muted">
            {{ t('staff.noInvitations') }}
          </p>
          <ul v-else class="divide-y divide-line">
            <StaffRow
              v-for="i in open"
              :key="i.id"
              :person-id="i.person_id"
              :permit="i.permit"
              :invite-id="i.id"
              :identifier="i.identifier"
            />
          </ul>
        </QueryState>
      </Panel>
    </div>

    <InviteDialog v-model:open="adding" />
  </AdminGate>
</template>
