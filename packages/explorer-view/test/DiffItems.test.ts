import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffItems/DiffItems.ts'

test('updates the drag handler when pointer down selects a different drag source', () => {
  const state = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'a.txt', path: '/a.txt', posInSet: 1, selected: false, setSize: 1, type: 7 }],
    platform: 2,
  }
  expect(isEqual(state, state)).toBe(true)
  expect(isEqual(state, { ...state, pointerDownIndex: 0 })).toBe(false)
})
