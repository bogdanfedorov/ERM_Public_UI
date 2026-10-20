<script setup lang="ts">
import { computed, ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQueryClient } from '@tanstack/vue-query'
import { FlaskConical, LogIn, LogOut, X } from 'lucide-vue-next'
import { ApiError } from '../../api/client'
import Button from '../../ui/Button.vue'
import Notice from '../../ui/Notice.vue'
import { errorMessage } from '../common/errors'
import { forget, isAccountId, recentAccounts, remember, signIn, signOut } from './devSession'
import { useSignOut } from './useSignOut'
import { type Ref } from 'vue'
import type { Schemas } from '../../api/client'

const props = defineProps<{
  item: {
    getMe: (enabled?: Ref<boolean>) => {
      data: Ref<Schemas['Me'] | undefined>
      queryKey: ComputedRef<unknown[]>
    }
  }
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const client = useQueryClient()
const signOutNow = useSignOut()

let me = props.item.getMe()
const accountId = ref('')
const recent = ref(recentAccounts())
const error = ref<string>()
const busy = ref(false)

const valid = computed(() => isAccountId(accountId.value))
const target = computed(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/'
})

const enter = async (id: string) => {
  if (!isAccountId(id) || busy.value) return
  busy.value = true
  error.value = undefined
  client.clear()
  try {
    await signIn(id)
    me = await props.item.getMe();
    remember(id)
    await router.replace(target.value)
  } catch (e) {
    await signOut()
    client.clear()
    error.value = e instanceof ApiError && e.status === 401 ? t('auth.unknownAccount') : errorMessage(e, t)
  } finally {
    busy.value = false
    recent.value = recentAccounts()
  }
}

const drop = (id: string) => {
  forget(id)
  recent.value = recentAccounts()
}
</script>

<template>
  <main class="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
    <div class="mb-6 flex items-center gap-3">
      <span class="grid size-10 place-items-center rounded-xl bg-warn-soft text-warn">
        <FlaskConical class="size-5" />
      </span>
      <div>
        <h1 class="text-xl font-semibold">{{ t('auth.title') }}</h1>
        <p class="text-sm text-ink-muted">{{ t('auth.subtitle') }}</p>
      </div>
    </div>

    <Notice v-if="me.data.value" class="mb-4">
      <p>{{ t('auth.signedInAs', { id: me.data.value.account.id }) }}</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <Button size="sm" variant="primary" @click="router.replace(target)">{{ t('auth.continue') }}</Button>
        <Button size="sm" @click="signOutNow"><LogOut />{{ t('auth.signOut') }}</Button>
      </div>
    </Notice>

    <form class="rounded-xl border border-line bg-surface p-4" @submit.prevent="enter(accountId)">
      <label for="account-id" class="mb-1.5 block text-sm font-medium">{{ t('auth.accountId') }}</label>
      <input
        id="account-id"
        v-model="accountId"
        autocomplete="off"
        spellcheck="false"
        placeholder="00000000-0000-4000-8000-000000000000"
        :aria-invalid="accountId !== '' && !valid"
        class="h-row w-full rounded-lg border border-line-strong bg-paper px-3 font-mono text-sm placeholder:text-ink-faint aria-invalid:border-bad"
      />
      <p v-if="accountId !== '' && !valid" class="mt-1.5 text-xs text-bad">{{ t('auth.invalidId') }}</p>
      <Notice v-if="error" tone="bad" class="mt-3">{{ error }}</Notice>
      <Button type="submit" variant="primary" class="mt-3 w-full" :disabled="!valid || busy">
        <LogIn />{{ t('auth.signIn') }}
      </Button>
    </form>

    <section v-if="recent.length" class="mt-5">
      <h2 class="mb-2 text-xs font-medium text-ink-muted uppercase">{{ t('auth.recent') }}</h2>
      <ul class="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        <li v-for="id in recent" :key="id" class="flex items-center">
          <button
            class="min-h-row flex-1 px-4 py-2 text-left font-mono text-[13px] break-all hover:bg-sunken"
            :disabled="busy"
            @click="enter(id)"
          >
            {{ id }}
          </button>
          <button
            class="grid size-row place-items-center text-ink-faint hover:text-ink"
            :aria-label="t('auth.forget')"
            @click="drop(id)"
          >
            <X class="size-4" />
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>
