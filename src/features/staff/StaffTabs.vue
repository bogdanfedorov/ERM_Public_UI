<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TabNav from '../../ui/TabNav.vue'
import { useTenant } from '../tenant/useTenant'

const { t } = useI18n()
const { id: tenant } = useTenant()
const tabs = ['staff', 'groups'] as const
</script>

<template>
  <TabNav
    :label="t('staff.title')"
    :items="tabs.map((tab) => ({ to: { name: tab, params: { tenant } }, label: t(`staff.tab.${tab}`) }))"
  />
</template>
