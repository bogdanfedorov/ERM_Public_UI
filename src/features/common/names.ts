import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { titleOf } from '../../model/fields'
import type { Schemas } from '../../api/client'
import type { Entity } from '../../api/queries'
import { useTenant } from '../tenant/useTenant'

export const useFields = (entity: MaybeRefOrGetter<Entity>) => {
  const { q } = useTenant()
  return useQuery(computed(() => q.value.fields(toValue(entity))))
}

export const useOfferingTitle = () => {
  const fields = useFields('offering')
  return (offering: Pick<Schemas['Offering'], 'kind' | 'attrs'>) =>
    titleOf(fields.data.value?.items ?? [], offering.attrs) ?? offering.kind
}

export const usePerson = (id: MaybeRefOrGetter<string>) => {
  const { q } = useTenant()
  return useQuery(computed(() => q.value.person(toValue(id))))
}

export const useOffering = (id: MaybeRefOrGetter<string>) => {
  const { q } = useTenant()
  return useQuery(computed(() => q.value.offering(toValue(id))))
}
