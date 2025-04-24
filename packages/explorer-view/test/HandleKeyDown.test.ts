import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleKeyDown } from '../src/parts/HandleKeyDown/HandleKeyDown.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

test('handleKeyDown - empty state', () => {
  const state = createDefaultState()
  const newState = handleKeyDown(state, 'a')
  expect(newState.focusWord).toBe('a')
  expect(newState.focusedIndex).toBe(0)
})

test('handleKeyDown - with items', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'apple', type: 0, path: '/apple', depth: 0, selected: false },
      { name: 'banana', type: 0, path: '/banana', depth: 0, selected: false },
      { name: 'cherry', type: 0, path: '/cherry', depth: 0, selected: false },
    ],
  }
  const newState = handleKeyDown(state, 'b')
  expect(newState.focusWord).toBe('b')
  expect(newState.focusedIndex).toBe(1)
})

test('handleKeyDown - no match', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'apple', type: 0, path: '/apple', depth: 0, selected: false },
      { name: 'banana', type: 0, path: '/banana', depth: 0, selected: false },
      { name: 'cherry', type: 0, path: '/cherry', depth: 0, selected: false },
    ],
  }
  const newState = handleKeyDown(state, 'x')
  expect(newState.focusWord).toBe('x')
  expect(newState.focusedIndex).toBe(0)
})

test('handleKeyDown - multiple characters', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'apple', type: 0, path: '/apple', depth: 0, selected: false },
      { name: 'banana', type: 0, path: '/banana', depth: 0, selected: false },
      { name: 'cherry', type: 0, path: '/cherry', depth: 0, selected: false },
    ],
  }
  let newState = handleKeyDown(state, 'b')
  newState = handleKeyDown(newState, 'a')
  expect(newState.focusWord).toBe('ba')
  expect(newState.focusedIndex).toBe(1)
})
