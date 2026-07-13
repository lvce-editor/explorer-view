import { afterEach, expect, jest, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleKeyDown } from '../src/parts/HandleKeyDown/HandleKeyDown.ts'

jest.useFakeTimers()

afterEach(() => {
  jest.clearAllTimers()
})

test('handleKeyDown - empty state', () => {
  const state = createDefaultState()
  const newState = handleKeyDown(state, false, 'a')
  expect(newState.focusWord).toBe('a')
  expect(newState.focusedIndex).toBe(0)
})

test('handleKeyDown - with items', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  const newState = handleKeyDown(state, false, 'b')
  expect(newState.focusWord).toBe('b')
  expect(newState.focusedIndex).toBe(1)
})

test('handleKeyDown - no match', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  const newState = handleKeyDown(state, false, 'x')
  expect(newState.focusWord).toBe('x')
  expect(newState.focusedIndex).toBe(0)
})

test('handleKeyDown - multiple characters', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  let newState = handleKeyDown(state, false, 'b')
  newState = handleKeyDown(newState, false, 'a')
  expect(newState.focusWord).toBe('ba')
  expect(newState.focusedIndex).toBe(1)
})

test('handleKeyDown - ignores handled keybindings', () => {
  const state = createDefaultState()
  const newState = handleKeyDown(state, true, 'b')
  expect(newState).toBe(state)
})

test('handleKeyDown - supports uppercase keys', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'apple', path: '/apple', selected: false, type: 0 },
      { depth: 0, name: 'banana', path: '/banana', selected: false, type: 0 },
      { depth: 0, name: 'cherry', path: '/cherry', selected: false, type: 0 },
    ],
  }
  const newState = handleKeyDown(state, false, 'B')
  expect(newState.focusWord).toBe('b')
  expect(newState.focusedIndex).toBe(1)
})
