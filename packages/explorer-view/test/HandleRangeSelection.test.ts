import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleRangeSelection } from '../src/parts/HandleRangeSelection/HandleRangeSelection.ts'

const createItem = (name: string, selected: boolean): ExplorerItem => ({
  name,
  type: 0,
  path: `/${name}`,
  depth: 0,
  selected,
})

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
  expect(() => handleRangeSelection(state, 2, 0)).toThrow(new Error('startIndex must be less than or equal to endIndex'))
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

test('selects items in range', () => {
  const state = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false), createItem('c', false), createItem('d', false)],
  }

  const newState = handleRangeSelection(state, 1, 2)

  expect(newState.items).toEqual([createItem('a', false), createItem('b', true), createItem('c', true), createItem('d', false)])
})

test('throws error when startIndex > endIndex', () => {
  const state = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false)],
  }

  expect(() => handleRangeSelection(state, 1, 0)).toThrow('startIndex must be less than or equal to endIndex')
})
