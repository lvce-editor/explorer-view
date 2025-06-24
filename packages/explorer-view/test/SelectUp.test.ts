import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectUp } from '../src/parts/SelectUp/SelectUp.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

test('selectUp - first item', () => {
  const state = createDefaultState()
  const newState = selectUp(state)
  expect(newState).toBe(state)
})

test('selectUp - second item', () => {
  const state: ExplorerState = {
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

test.skip('selectUp - multiple items with selection', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: true },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
    focusedIndex: 2,
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})

test('selectUp - multiple items with selection at top', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: true },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
    focusedIndex: 1,
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test.skip('selectUp - multiple items with multiple selections', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: true },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: true },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
    focusedIndex: 2,
  }
  const newState = selectUp(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})
