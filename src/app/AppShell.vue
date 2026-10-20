<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CalendarDays,
  Layers,
  LogOut,
  Monitor,
  Moon,
  Rows3,
  Rows4,
  Sun,
  Sunrise,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-vue-next'
import { useSignOut } from '../features/auth/useSignOut'
import { useTenant } from '../features/tenant/useTenant'
import QueryState from '../features/common/QueryState.vue'
import Notice from '../ui/Notice.vue'
import { density, theme, type Theme } from './preferences'

const { t } = useI18n()
const { id, me, membership } = useTenant()
const signOut = useSignOut()
const identity = computed(() => {
  const account = me.data.value?.account
  return account?.identities[0]?.identifier ?? account?.id
})

const nav = computed(() => [
  { name: 'today', label: t('nav.today'), icon: Sunrise },
  { name: 'schedule', label: t('nav.schedule'), icon: CalendarDays },
  { name: 'people', label: t('nav.people'), icon: Users },
  { name: 'offerings', label: t('nav.offerings'), icon: Layers },
  ...(membership.value?.admin
    ? [
        { name: 'staff', label: t('nav.staff'), icon: ShieldCheck },
        { name: 'fields', label: t('nav.fields'), icon: SlidersHorizontal },
      ]
    : []),
])

const themes: { value: Theme; icon: typeof Sun }[] = [
  { value: 'system', icon: Monitor },
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
]

const nextTheme = () => {
  const i = themes.findIndex((x) => x.value === theme.value)
  theme.value = themes[(i + 1) % themes.length]!.value
}
const themeIcon = computed(() => themes.find((x) => x.value === theme.value)!.icon)
const toggleDensity = () => (density.value = density.value === 'compact' ? 'regular' : 'compact')
</script>

<template>
  <div class="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
    <aside class="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface px-3 py-4 lg:flex">
      <RouterLink to="/" class="mb-6 flex items-center gap-2 px-2 text-sm font-semibold">
        <span class="grid size-7 place-items-center rounded-lg bg-accent text-xs text-accent-ink">E</span>
        {{ t('app.name') }}
      </RouterLink>
      <nav :aria-label="t('nav.main')" class="flex flex-col gap-0.5">
        <RouterLink
          v-for="item in nav"
          :key="item.name"
          :to="{ name: item.name, params: { tenant: id } }"
          class="flex min-h-row items-center gap-2.5 rounded-lg px-2.5 text-sm text-ink-muted hover:bg-sunken hover:text-ink"
          active-class="!bg-accent-soft !text-ink font-medium"
        >
          <component :is="item.icon" class="size-4" aria-hidden="true" />
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="mt-auto flex flex-col gap-0.5 border-t border-line pt-3 text-sm">
        <button
          class="flex min-h-row items-center gap-2.5 rounded-lg px-2.5 text-ink-muted hover:bg-sunken hover:text-ink"
          @click="nextTheme"
        >
          <component :is="themeIcon" class="size-4" />{{ t('nav.theme') }}: {{ t(`theme.${theme}`) }}
        </button>
        <button
          class="flex min-h-row items-center gap-2.5 rounded-lg px-2.5 text-ink-muted hover:bg-sunken hover:text-ink"
          @click="toggleDensity"
        >
          <component :is="density === 'compact' ? Rows4 : Rows3" class="size-4" />
          {{ t('nav.density') }}: {{ t(`density.${density}`) }}
        </button>
        <RouterLink
          to="/"
          class="flex min-h-row items-center gap-2.5 rounded-lg px-2.5 text-ink-muted hover:bg-sunken hover:text-ink"
        >
          <Layers class="size-4" />{{ t('nav.switchTenant') }}
        </RouterLink>
        <div class="mt-2 flex items-center gap-2 border-t border-line px-2.5 pt-3">
          <span class="min-w-0 flex-1 truncate text-xs text-ink-muted" :title="me.data.value?.account.id">
            {{ identity }}
          </span>
          <button
            class="grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-sunken hover:text-ink"
            :aria-label="t('auth.signOut')"
            :title="t('auth.signOut')"
            @click="signOut"
          >
            <LogOut class="size-4" />
          </button>
        </div>
      </div>
    </aside>

    <div class="min-w-0 pb-20 lg:pb-0">
      <header
        class="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur lg:hidden"
      >
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-semibold">
          <span class="grid size-7 place-items-center rounded-lg bg-accent text-xs text-accent-ink">E</span>
          {{ t('app.name') }}
        </RouterLink>
        <span class="flex-1" />
        <button
          class="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-sunken"
          :aria-label="`${t('nav.theme')}: ${t(`theme.${theme}`)}`"
          @click="nextTheme"
        >
          <component :is="themeIcon" class="size-4" />
        </button>
        <button
          class="grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-sunken"
          :aria-label="t('auth.signOut')"
          @click="signOut"
        >
          <LogOut class="size-4" />
        </button>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
        <QueryState :pending="me.isPending.value" :error="me.error.value" :refetch="me.refetch">
          <Notice v-if="!membership" tone="bad">{{ t('error.forbidden') }}</Notice>
          <RouterView v-else :key="id" />
        </QueryState>
      </main>
    </div>

    <nav
      :aria-label="t('nav.main')"
      class="fixed inset-x-0 bottom-0 z-30 grid auto-cols-fr grid-flow-col border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <RouterLink
        v-for="item in nav"
        :key="item.name"
        :to="{ name: item.name, params: { tenant: id } }"
        class="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-ink-muted"
        active-class="!text-accent font-medium"
      >
        <component :is="item.icon" class="size-5" aria-hidden="true" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </div>
</template>
