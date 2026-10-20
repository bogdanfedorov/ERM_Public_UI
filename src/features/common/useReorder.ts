import { useMutation, useQueryClient, type QueryKey } from '@tanstack/vue-query'
import { ActionDenied, newIntentKey } from '../../api/queries'
import { placeAfter, type Ordered } from '../../model/order'

export type Move = { id: string; afterId?: string }

export const useReorder = <T extends Ordered, D>(options: {
  queryKey: () => QueryKey
  list: (data: D) => T[]
  rebuild: (data: D, items: T[]) => D
  move: (id: string, afterId: string | undefined, intentKey: string) => Promise<unknown>
}) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, afterId }: Move) => options.move(id, afterId, newIntentKey()),
    onMutate: async ({ id, afterId }) => {
      const queryKey = options.queryKey()
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData<D>(queryKey)
      if (previous) {
        client.setQueryData(
          queryKey,
          options.rebuild(previous, placeAfter(options.list(previous), id, afterId)),
        )
      }
      return { previous, queryKey }
    },
    onError: (error, _move, context) => {
      if (context?.previous) client.setQueryData(context.queryKey, context.previous)
      if (error instanceof ActionDenied) client.invalidateQueries({ queryKey: ['me'] })
    },
    onSettled: (_data, _error, _move, context) =>
      client.invalidateQueries({ queryKey: context?.queryKey ?? options.queryKey() }),
  })
}
