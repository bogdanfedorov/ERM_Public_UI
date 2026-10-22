<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ChevronRight, LogOut, Mail, School } from 'lucide-vue-next'
import { useSignOut } from '../auth/useSignOut'
import Button from '../../ui/Button.vue'
import { meQuery, newIntentKey, tenantQueries } from '../../api/queries'
import Badge from '../../ui/Badge.vue'
import Notice from '../../ui/Notice.vue'
import QueryState from '../common/QueryState.vue'
import { errorMessage } from '../common/errors'

const { t } = useI18n()
const router = useRouter()
const me = useQuery(meQuery())
const signOut = useSignOut()

const client = useQueryClient()
const tenants = computed(() => me.data.value?.tenants ?? [])
const invitations = computed(() => me.data.value?.invitations ?? [])

const accept = useMutation({
  mutationFn: (inv: { invite_id: string; tenant_id: string }) =>
    tenantQueries(inv.tenant_id).acceptInvite(inv.invite_id, newIntentKey()),
  onSettled: () => client.invalidateQueries({ queryKey: ['me'] }),
})
const active = computed(() => tenants.value.filter((x) => x.status === 'active'))

watchEffect(() => {
  const only =
    active.value.length === 1 && tenants.value.length === 1 && invitations.value.length === 0
      ? active.value[0]
      : undefined
  if (only) router.replace({ name: 'today', params: { tenant: only.id } })
})

const tone = { active: 'ok', suspended: 'warn', archived: 'neutral' } as const
</script>

<template>
  <main class="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4 py-10">
    <div class="mb-6 flex items-center gap-3">
      <span class="grid size-10 place-items-center rounded-xl bg-accent text-accent-ink">
        <School class="size-5" />
      </span>
      <div>
        <h1 class="text-xl font-semibold">{{ t('tenant.title') }}</h1>
        <p class="text-sm text-ink-muted">{{ t('tenant.subtitle') }}</p>
      </div>
    </div>

    <QueryState :pending="me.isPending.value" :error="me.error.value" :refetch="me.refetch">
      <section v-if="invitations.length" class="mb-4 rounded-xl border border-accent bg-accent-soft p-4">
        <h2 class="flex items-center gap-2 text-sm font-semibold">
          <Mail class="size-4" />{{ t('tenant.invitations') }}
        </h2>
        <p class="mt-1 text-sm text-ink-muted">{{ t('tenant.invitationHint') }}</p>
        <ul class="mt-3 flex flex-col gap-2">
          <li
            v-for="inv in invitations"
            :key="inv.invite_id"
            class="flex items-center gap-3 rounded-lg bg-surface px-3 py-2"
          >
            <span class="min-w-0 flex-1 truncate font-mono text-xs text-ink-faint">{{ inv.tenant_id }}</span>
            <Button
              size="sm"
              variant="primary"
              :disabled="accept.isPending.value"
              @click="accept.mutate(inv)"
            >
              {{ t('tenant.accept') }}
            </Button>
          </li>
        </ul>
        <Notice v-if="accept.error.value" tone="bad" class="mt-3">{{
          errorMessage(accept.error.value, t)
        }}</Notice>
      </section>
      <Notice v-if="tenants.length === 0 && invitations.length === 0">{{ t('tenant.none') }}</Notice>
      <ul v-else class="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        <li v-for="tenant in tenants" :key="tenant.id">
          <RouterLink
            v-if="tenant.status === 'active'"
            :to="{ name: 'today', params: { tenant: tenant.id } }"
            class="flex items-center gap-3 px-4 py-3 hover:bg-sunken"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate font-mono text-xs text-ink-faint">{{ tenant.id }}</p>
              <p class="mt-1 flex flex-wrap gap-1.5 text-sm">
                <Badge v-for="g in tenant.groups" :key="g.id" :tone="tenant.admin ? 'accent' : 'neutral'">{{
                  g.name
                }}</Badge>
              </p>
            </div>
            <ChevronRight class="size-4 text-ink-faint" />
          </RouterLink>
          <div v-else class="flex items-center gap-3 px-4 py-3 opacity-70">
            <p class="min-w-0 flex-1 truncate font-mono text-xs text-ink-faint">{{ tenant.id }}</p>
            <Badge :tone="tone[tenant.status]">{{ t(`tenant.status.${tenant.status}`) }}</Badge>
          </div>
        </li>
      </ul>
    </QueryState>

    <div v-if="me.data.value" class="mt-6 flex items-center justify-between gap-3 text-sm text-ink-muted">
      <span class="min-w-0 truncate">{{
        me.data.value.account.identities[0]?.identifier ?? me.data.value.account.id
      }}</span>
      <Button size="sm" variant="ghost" @click="signOut"><LogOut />{{ t('auth.signOut') }}</Button>
    </div>
  </main>
</template>
