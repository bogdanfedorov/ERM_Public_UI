import { describe, expect, it } from 'vitest'
import { afterOf, dropAfter, neighbour } from './sortable'

const list = ['a', 'b', 'c', 'd'].map((id) => ({ id }))

describe('sortable gestures', () => {
  it('names the item an element currently follows', () => {
    expect(afterOf(list, 'c')).toBe('b')
    expect(afterOf(list, 'a')).toBeUndefined()
  })

  it('moves one step up or down', () => {
    expect(neighbour(list, 'c', -1)).toEqual({ afterId: 'a' })
    expect(neighbour(list, 'b', -1)).toEqual({ afterId: undefined })
    expect(neighbour(list, 'b', 1)).toEqual({ afterId: 'c' })
    expect(neighbour(list, 'a', -1)).toBeUndefined()
    expect(neighbour(list, 'd', 1)).toBeUndefined()
  })

  it('drops onto another row', () => {
    expect(dropAfter(list, 'a', 'c')).toEqual({ afterId: 'c' })
    expect(dropAfter(list, 'd', 'b')).toEqual({ afterId: 'a' })
    expect(dropAfter(list, 'd', 'a')).toEqual({ afterId: undefined })
    expect(dropAfter(list, 'b', 'b')).toBeUndefined()
  })
})
