import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { selectDown } from '../src/parts/SelectDown/SelectDown.ts'

test('selectDown - last item', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
    ],
    focusedIndex: 1,
  }
  const newState = selectDown(state)
  expect(newState).toBe(state)
})

test('selectDown - first item', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
    ],
    focusedIndex: 0,
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
})

test('selectDown - multiple items with selection', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: true },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
    focusedIndex: 0,
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})

test('selectDown - multiple items with selection at bottom', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: false },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: false },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: true },
    ],
    focusedIndex: 1,
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(true)
})

test('selectDown - multiple items with multiple selections', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'a', type: 0, path: '/a', depth: 1, selected: true },
      { name: 'b', type: 0, path: '/b', depth: 1, selected: true },
      { name: 'c', type: 0, path: '/c', depth: 1, selected: false },
    ],
    focusedIndex: 0,
  }
  const newState = selectDown(state)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(false)
})
