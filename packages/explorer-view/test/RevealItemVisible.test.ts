import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { revealItemVisible } from '../src/parts/RevealItemVisible/RevealItemVisible.ts'

const items = Array.from({ length: 10 }, (_, index) => ({
  depth: 0,
  name: `file-${index}.txt`,
  path: `/file-${index}.txt`,
  selected: false,
  type: 1,
}))

test('revealItemVisible - clamps the scroll position when revealing the last item', () => {
  const state = {
    ...createDefaultState(),
    height: 100,
    items,
    maxLineY: 6,
  }
  const result = revealItemVisible(state, 9)
  expect(result).toEqual({
    ...state,
    deltaY: 100,
    focused: true,
    focusedIndex: 9,
    maxLineY: 11,
    minLineY: 5,
  })
})

test('revealItemVisible - preserves the scroll position when the item is already visible', () => {
  const state = {
    ...createDefaultState(),
    deltaY: 40,
    height: 100,
    items,
    maxLineY: 8,
    minLineY: 2,
  }
  const result = revealItemVisible(state, 4)
  expect(result).toEqual({
    ...state,
    focused: true,
    focusedIndex: 4,
  })
})
