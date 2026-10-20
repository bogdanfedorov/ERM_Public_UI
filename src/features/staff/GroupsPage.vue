<script setup lang="ts">
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { Lock, Plus } from 'lucide-vue-next'
import type { Rule } from '../../model/access'
import { letters } from '../../model/mode'
import Badge from '../../ui/Badge.vue'
import Button from '../../ui/Button.vue'
import PageHeader from '../../ui/PageHeader.vue'
import Panel from '../../ui/Panel.vue'
import AdminGate from '../common/AdminGate.vue'
import QueryState from '../common/QueryState.vue'
import { useTenant } from '../tenant/useTenant'
import GroupDialog from './GroupDialog.vue'
import StaffTabs from './StaffTabs.vue'
import type { Schemas } from '../../api/client'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../../api/schema'

const props = defineProps<{
  item: {
    getGroups: (enabled?: Ref<boolean>) => {
      data: Ref<Schemas['AccessGroupPage'] | undefined>
      queryKey: ComputedRef<unknown[]>
    }
  }
  mutate: {
    createGroup: (body: MaybeOptionalInit<paths['/groups'], 'post'>) => Promise<void>
    updateGroup: (body: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'patch'>) => Promise<void>
    deleteGroup: (body: MaybeOptionalInit<paths['/groups/{access_group_id}'], 'delete'>) => Promise<void>
  }
}>()

type Group = { id: string; name: string; rules: Rule[]; system?: boolean }

const { t } = useI18n()
const { q, admin } = useTenant()
const groups = useQuery(computed(() => ({ ...q.value.groups(), enabled: admin.value })))
const editing = ref(false)
const chosen = ref<Group>()

const open = (group?: Group) => {
  chosen.value = group
  editing.value = true
}
const resourceName = (resource: string) => t(`resource.${resource === '*' ? 'any' : resource}`)
</script>

<template>
  <AdminGate :message="t('staff.adminsOnly')">
    <PageHeader :title="t('staff.title')" :subtitle="t('groups.subtitle')">
      <Button variant="primary" @click="open()"><Plus />{{ t('groups.add') }}</Button>
    </PageHeader>
    <StaffTabs />

    <Panel>
      <QueryState :pending="groups.isPending.value" :error="groups.error.value" :refetch="groups.refetch">
        <ul class="divide-y divide-line">
          <li
            v-for="g in groups.data.value?.items ?? []"
            :key="g.id"
            class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm"
          >
            <span class="flex min-w-40 items-center gap-2 font-medium">
              <Lock v-if="g.system" class="size-4 text-ink-faint" :aria-label="t('groups.system')" />
              {{ g.name }}
            </span>
            <span class="flex flex-1 flex-wrap gap-1.5">
              <Badge v-for="r in g.rules" :key="r.resource" :tone="r.scope === 'all' ? 'accent' : 'neutral'">
                {{ resourceName(r.resource) }} · {{ letters(r.mode)
                }}{{ r.fields ? ' · ' + t('staff.someFields') : '' }}
              </Badge>
            </span>
            <Button v-if="!g.system" size="sm" @click="open(g)">{{ t('groups.edit') }}</Button>
          </li>
        </ul>
      </QueryState>
    </Panel>

    <GroupDialog v-model:open="editing" :group="chosen" />
  </AdminGate>
</template>
