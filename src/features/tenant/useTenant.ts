import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { meQuery, tenantQueries, type TenantQueries } from '../../api/queries'

const scoped = new Map<string, TenantQueries>()

const queriesFor = (tenantId: string) => {
  let queries = scoped.get(tenantId)
  if (!queries) {
    queries = tenantQueries(tenantId)
    scoped.set(tenantId, queries)
  }
  return queries
}

export const useTenant = () => {
  const route = useRoute()
  const id = computed(() => String(route.params.tenant))
  const q = computed(() => queriesFor(id.value))
  const me = useQuery(meQuery())
  const membership = computed(() => me.data.value?.tenants.find((t) => t.id === id.value))
  const admin = computed(() => membership.value?.admin === true)
  return { id, q, me, membership, admin }
}
