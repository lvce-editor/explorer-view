import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectDown } from '../src/parts/SelectDown/SelectDown.ts'

const createTestState = (): ExplorerState => ({
  ...createDefaultState(),
  items: [
    { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
    { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
    { depth: 1, name: 'c', selected: false, type: 0, uri: '/c' },
  ],
})

const createStateWithSelections = (selectedIndices: number[]): ExplorerState => {
  const state = createTestState()
  const { items } = state
  return {
    ...state,
    items: items.map((item, index) => ({
      ...item,
      selected: selectedIndices.includes(index),
    })),
  }
}

test.skip('selectDown - no selection', () => {
  const state = createTestState()
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(true)
})

test('selectDown - single selection', () => {
  const state = createStateWithSelections([0])
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
})

test('selectDown - multiple selections', () => {
  const state = createStateWithSelections([0, 1])
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('selectDown - at end', () => {
  const state = createTestState()
  const { items } = state
  const lastIndex = items.length - 1
  const stateWithSelection = createStateWithSelections([lastIndex])
  const newState = selectDown(stateWithSelection)
  expect(newState.items[lastIndex].selected).toBe(true)
})

test('selectDown - last item', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
    ],
  }
  const newState = selectDown(state)
  expect(newState).toBe(state)
})

test('selectDown - first item', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
    ],
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
})

test.skip('selectDown - multiple items with selection', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: true, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: false, type: 0, uri: '/c' },
    ],
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})

test('selectDown - multiple items with selection at bottom', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: true, type: 0, uri: '/c' },
    ],
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(true)
})

test.skip('selectDown - multiple items with multiple selections', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 1, name: 'a', selected: true, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: true, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: false, type: 0, uri: '/c' },
    ],
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})
