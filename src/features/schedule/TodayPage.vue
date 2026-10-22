<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { dayWindow, today } from '../../model/time'
import Notice from '../../ui/Notice.vue'
import QueryState from '../common/QueryState.vue'
import { useTenant } from '../tenant/useTenant'
import LessonCard from './LessonCard.vue'

const { t } = useI18n()
const { q } = useTenant()
const day = today()
const lessons = useQuery(computed(() => q.value.schedule(dayWindow(day))))
const items = computed(() => lessons.data.value?.items ?? [])
const heading = day.toLocaleString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-5">
      <h1 class="text-2xl font-semibold">{{ t('schedule.today') }}</h1>
      <p class="text-sm text-ink-muted first-letter:uppercase">
        {{ heading
        }}<template v-if="lessons.data.value"> · {{ t('schedule.lessons', items.length) }}</template>
      </p>
    </div>

    <QueryState
      :pending="lessons.isPending.value"
      :error="lessons.error.value"
      :refetch="lessons.refetch"
      :rows="4"
    >
      <Notice v-if="items.length === 0">{{ t('schedule.emptyToday') }}</Notice>
      <div v-else class="flex flex-col gap-2">
        <LessonCard v-for="lesson in items" :key="`${lesson.offering_id}:${lesson.start}`" :lesson="lesson" />
      </div>
    </QueryState>
  </div>
</template>
