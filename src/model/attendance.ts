export type AttendanceRecord = {
  id: string
  person_id: string
  start: string
  result: 'present' | 'absent' | 'late'
  supersedes?: string
}

export const current = <T extends AttendanceRecord>(records: readonly T[]) => {
  const replaced = new Set(records.flatMap((r) => (r.supersedes ? [r.supersedes] : [])))
  return records.filter((r) => !replaced.has(r.id))
}

export const history = <T extends AttendanceRecord>(records: readonly T[], head: T) => {
  const byId = new Map(records.map((r) => [r.id, r]))
  const chain: T[] = []
  for (let r: T | undefined = head; r; r = r.supersedes ? byId.get(r.supersedes) : undefined) {
    if (chain.includes(r)) break
    chain.push(r)
  }
  return chain
}
