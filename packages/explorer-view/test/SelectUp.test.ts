import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectUp } from '../src/parts/SelectUp/SelectUp.ts'

test('selectUp - first item', () => {
  const state = createDefaultState()
  const newState = selectUp(state)
  expect(newState).toBe(state)
})

test('selectUp - second item', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
    ],
    focusedIndex: 1,
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
})
