import { describe, expect, it } from 'vitest'
import { placeAfter } from './order'

const list = ['a', 'b', 'c', 'd'].map((id) => ({ id }))
const ids = (items: { id: string }[]) => items.map((x) => x.id).join('')

describe('order', () => {
  it('places an item after another or first', () => {
    expect(ids(placeAfter(list, 'd', 'a'))).toBe('adbc')
    expect(ids(placeAfter(list, 'c', undefined))).toBe('cabd')
    expect(ids(placeAfter(list, 'a', 'c'))).toBe('bcad')
    expect(ids(placeAfter(list, 'x', 'a'))).toBe('abcd')
  })
})
