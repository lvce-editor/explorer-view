import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffItems/DiffItems.ts'

test('updates the drag handler when pointer down selects a different drag source', () => {
  const state = createDefaultState()
  expect(isEqual(state, state)).toBe(true)
  expect(isEqual(state, { ...state, pointerDownIndex: 0 })).toBe(false)
})
