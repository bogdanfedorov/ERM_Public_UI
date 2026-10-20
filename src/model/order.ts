export type Ordered = { id: string }

export const placeAfter = <T extends Ordered>(items: readonly T[], id: string, afterId?: string): T[] => {
  const moved = items.find((x) => x.id === id)
  if (!moved) return [...items]
  const rest = items.filter((x) => x.id !== id)
  const at = afterId === undefined ? 0 : rest.findIndex((x) => x.id === afterId) + 1
  return [...rest.slice(0, at), moved, ...rest.slice(at)]
}
