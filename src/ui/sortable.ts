type Identified = { id: string }

export const afterOf = <T extends Identified>(items: readonly T[], id: string): string | undefined => {
  const i = items.findIndex((x) => x.id === id)
  return i > 0 ? items[i - 1]!.id : undefined
}

export const neighbour = <T extends Identified>(items: readonly T[], id: string, step: -1 | 1) => {
  const i = items.findIndex((x) => x.id === id)
  const to = i + step
  if (i < 0 || to < 0 || to >= items.length) return undefined
  const target = step === -1 ? to - 1 : to
  return { afterId: target >= 0 ? items[target]!.id : undefined }
}

export const dropAfter = <T extends Identified>(items: readonly T[], id: string, overId: string) => {
  const from = items.findIndex((x) => x.id === id)
  const over = items.findIndex((x) => x.id === overId)
  if (from < 0 || over < 0 || from === over) return undefined
  return { afterId: from < over ? overId : afterOf(items, overId) }
}
