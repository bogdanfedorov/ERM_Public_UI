<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Check, Search } from 'lucide-vue-next'
import { ActionDenied, newIntentKey } from '../../api/queries'
import Button from '../../ui/Button.vue'
import Dialog from '../../ui/Dialog.vue'
import Notice from '../../ui/Notice.vue'
import QueryState from '../common/QueryState.vue'
import { errorMessage } from '../common/errors'
import { useTenant } from '../tenant/useTenant'

const props = defineProps<{ offeringId: string; title: string; taken: ReadonlySet<string> }>()
const open = defineModel<boolean>('open', { required: true })

const { t } = useI18n()
const { q } = useTenant()
const client = useQueryClient()
const people = useInfiniteQuery(computed(() => ({ ...q.value.people(), enabled: open.value })))

const filter = ref('')
const chosen = ref<string>()
const intent = ref(newIntentKey())

watch(open, (isOpen) => {
  if (!isOpen) return
  filter.value = ''
  chosen.value = undefined
  intent.value = newIntentKey()
  enroll.reset()
})

watch(chosen, () => {
  intent.value = newIntentKey()
})

const candidates = computed(() => {
  const all = people.data.value?.pages.flatMap((p) => p.items) ?? []
  const needle = filter.value.trim().toLocaleLowerCase('uk')
  return all.filter((p) => !needle || (p.label ?? '').toLocaleLowerCase('uk').includes(needle)).slice(0, 50)
})

const enroll = useMutation({
  mutationFn: (personId: string) => q.value.enroll(props.offeringId, personId, intent.value),
  onSuccess: async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: q.value.key('enrollment') }),
      client.invalidateQueries({ queryKey: q.value.key('schedule') }),
    ])
    open.value = false
  },
  onError: (error) => {
    if (error instanceof ActionDenied) client.invalidateQueries({ queryKey: ['me'] })
  },
})

const submit = () => {
  if (chosen.value && !enroll.isPending.value) enroll.mutate(chosen.value)
}
</script>

<template>
  <Dialog
    v-model:open="open"
    :title="t('offering.enrollTitle', { title })"
    :description="t('offering.enrollHint')"
    :close-label="t('app.close')"
  >
    <form class="flex flex-col gap-3" @submit.prevent="submit">
      <label class="relative">
        <span class="sr-only">{{ t('person.filter') }}</span>
        <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
        <input
          v-model="filter"
          type="search"
          :placeholder="t('person.filter')"
          class="h-row w-full rounded-lg border border-line-strong bg-paper pr-3 pl-9 text-sm placeholder:text-ink-faint"
        />
      </label>

      <QueryState :pending="people.isPending.value" :error="people.error.value" :rows="4">
        <p v-if="candidates.length === 0" class="py-4 text-center text-sm text-ink-muted">
          {{ t('app.nothingFound') }}
        </p>
        <ul
          v-else
          role="listbox"
          :aria-label="t('person.list')"
          class="max-h-72 divide-y divide-line overflow-y-auto rounded-lg border border-line"
        >
          <li v-for="p in candidates" :key="p.id">
            <button
              type="button"
              role="option"
              :aria-selected="chosen === p.id"
              :disabled="taken.has(p.id)"
              class="flex min-h-row w-full items-center justify-between gap-3 px-3 text-left text-sm hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-60 aria-selected:bg-accent-soft"
              @click="chosen = p.id"
            >
              <span class="truncate">{{ p.label || t('person.unnamed') }}</span>
              <span v-if="taken.has(p.id)" class="text-xs text-ink-muted">{{
                t('offering.alreadyEnrolled')
              }}</span>
              <Check v-else-if="chosen === p.id" class="size-4 text-accent" />
            </button>
          </li>
        </ul>
      </QueryState>

      <Notice v-if="enroll.error.value" tone="bad">{{ errorMessage(enroll.error.value, t) }}</Notice>

      <div class="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" @click="open = false">{{ t('app.close') }}</Button>
        <Button type="submit" variant="primary" :disabled="!chosen || enroll.isPending.value">
          {{ t('offering.enrollSubmit') }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>
