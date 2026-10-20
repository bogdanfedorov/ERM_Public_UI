import { ref, watch, type Ref, type WatchSource } from 'vue'
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/vue-query'
import { ActionDenied, newIntentKey } from '../../api/queries'

export const useIntent = (...changes: WatchSource[]) => {
  const intent = ref(newIntentKey())
  watch(changes, () => {
    intent.value = newIntentKey()
  })
  return intent
}

export const useAction = <V = void>(options: {
  run: (input: V) => Promise<unknown>
  invalidate: () => QueryKey[]
  closes?: Ref<boolean>
}) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: options.run,
    onSettled: () =>
      Promise.all(options.invalidate().map((queryKey) => client.invalidateQueries({ queryKey }))),
    onSuccess: () => {
      if (options.closes) options.closes.value = false
    },
    onError: (error: Error) => {
      if (error instanceof ActionDenied) client.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
