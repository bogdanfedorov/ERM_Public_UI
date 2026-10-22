<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus } from 'lucide-vue-next'
import type { Field } from '../../model/fields'
import Button from '../../ui/Button.vue'
import PageHeader from '../../ui/PageHeader.vue'
import Panel from '../../ui/Panel.vue'
import SortableList from '../../ui/SortableList.vue'
import TabNav from '../../ui/TabNav.vue'
import AdminGate from '../common/AdminGate.vue'
import QueryState from '../common/QueryState.vue'
import { useFields } from '../common/names'
import { useReorder } from '../common/useReorder'
import { useTenant } from '../tenant/useTenant'
import FieldDialog from './FieldDialog.vue'
import FieldRow from './FieldRow.vue'
import { entities, isEntity } from './entities'

const { t } = useI18n()
const route = useRoute()
const { id: tenant, q } = useTenant()
const entity = computed(() => (isEntity(route.params.entity) ? route.params.entity : 'person'))
const fields = useFields(entity)
const editing = ref(false)
const chosen = ref<Field>()

const rows = computed(() => fields.data.value?.items ?? [])
const reorder = useReorder({
  queryKey: () => q.value.fields(entity.value).queryKey,
  list: (data: { items: Field[] }) => data.items,
  rebuild: (data, items) => ({ ...data, items }),
  move: (id, afterId, intent) => q.value.moveField(id, afterId, intent),
})
const open = (field?: Field) => {
  chosen.value = field
  editing.value = true
}
</script>

<template>
  <AdminGate :message="t('fieldSettings.adminsOnly')">
    <PageHeader :title="t('fieldSettings.title')" :subtitle="t('fieldSettings.subtitle')">
      <Button variant="primary" @click="open()"><Plus />{{ t('fieldSettings.add') }}</Button>
    </PageHeader>
    <TabNav
      :label="t('fieldSettings.title')"
      :items="
        entities.map((e) => ({
          to: { name: 'fields', params: { tenant, entity: e } },
          label: t(`resource.${e}`),
        }))
      "
    />

    <Panel>
      <QueryState :pending="fields.isPending.value" :error="fields.error.value" :refetch="fields.refetch">
        <p v-if="rows.length === 0" class="px-4 py-3 text-sm text-ink-muted">
          {{ t('fieldSettings.empty') }}
        </p>
        <SortableList
          v-else
          :items="rows"
          :labels="{
            handle: t('fieldSettings.dragHandle'),
            up: t('fieldSettings.moveUp'),
            down: t('fieldSettings.moveDown'),
          }"
          @move="reorder.mutate($event)"
        >
          <template #default="{ item }"><FieldRow :field="item" @edit="open(item)" /></template>
        </SortableList>
      </QueryState>
    </Panel>

    <FieldDialog v-model:open="editing" :entity="entity" :field="chosen" />
  </AdminGate>
</template>
