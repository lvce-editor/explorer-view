import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleRangeSelection } from '../src/parts/HandleRangeSelection/HandleRangeSelection.ts'

test('handleRangeSelection - forward range', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('handleRangeSelection - backward range', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
  }
  const newState = handleRangeSelection(state, 2, 0)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('handleRangeSelection - preserve existing selections', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: true },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: true },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})
