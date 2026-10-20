export const R = 8
export const C = 4
export const U = 2
export const D = 1

export const rights = [
  { bit: R, letter: 'R' },
  { bit: C, letter: 'C' },
  { bit: U, letter: 'U' },
  { bit: D, letter: 'D' },
] as const

export const has = (mode: number, bit: number) => (mode & bit) === bit
export const canRead = (mode: number) => has(mode, R)
export const canUpdate = (mode: number) => has(mode, U)

export const letters = (mode: number) =>
  rights
    .filter((r) => has(mode, r.bit))
    .map((r) => r.letter)
    .join('')
