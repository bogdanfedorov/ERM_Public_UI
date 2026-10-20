<script setup lang="ts">
import { computed, ref, type Ref, type ComputedRef } from 'vue'
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
import { useReorder } from '../common/useReorder'
import FieldDialog from './FieldDialog.vue'
import FieldRow from './FieldRow.vue'
import { entities, isEntity } from './entities'
import type { Schemas } from '../../api/client'
import type { MaybeOptionalInit } from 'openapi-fetch'
import type { paths } from '../../api/schema'

const props = defineProps<{
  api: {
    getFields: (entity: Ref<MaybeOptionalInit<paths['/fields/{entity}'], 'get'>>) => {
      data: Ref<{ items: Schemas['FieldView'][]; next_cursor?: string } | undefined>
      queryKey: ComputedRef<unknown[]>
    }
  }
  mutate: {
    createField: (body: MaybeOptionalInit<paths['/field_definitions'], 'post'>) => Promise<void>
    updateField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}'], 'patch'>) => Promise<void>
    archiveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/archive'], 'post'>) => Promise<void>
    restoreField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/restore'], 'post'>) => Promise<void>
    moveField: (body: MaybeOptionalInit<paths['/field_definitions/{field_definition_id}/move'], 'post'>) => Promise<void>
  }
}>()

const { t } = useI18n()
const route = useRoute()
const tenant = computed(() => String(route.params.tenant))
const entity = computed(() => (isEntity(route.params.entity) ? route.params.entity : 'person'))
const fields = props.api.getFields(computed(() => ({ params: { path: { entity: entity.value } } })))
const editing = ref(false)
const chosen = ref<Field>()

const rows = computed(() => fields.data.value?.items ?? [])
const reorder = useReorder({
  queryKey: () => fields.queryKey.value,
  list: (data: { items: Field[] }) => data.items,
  rebuild: (data, items) => ({ ...data, items }),
  move: (id, afterId, intent) =>
    props.mutate.moveField({
      params: { path: { field_definition_id: id } },
      body: { after_id: afterId },
      headers: { 'Idempotency-Key': intent },
    }),
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
          <template #default="{ item }">
            <FieldRow
              :field="item"
              :archive-field="props.mutate.archiveField"
              :restore-field="props.mutate.restoreField"
              :fields-query-key="fields.queryKey"
              @edit="open(item)"
            />
          </template>
        </SortableList>
      </QueryState>
    </Panel>

    <FieldDialog
      v-model:open="editing"
      :entity="entity"
      :field="chosen"
      :create-field="props.mutate.createField"
      :update-field="props.mutate.updateField"
      :fields-query-key="fields.queryKey"
    />
  </AdminGate>
</template>
