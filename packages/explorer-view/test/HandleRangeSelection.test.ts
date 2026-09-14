import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleRangeSelection } from '../src/parts/HandleRangeSelection/HandleRangeSelection.ts'

const createItem = (name: string, selected: boolean): ExplorerItem => ({
  depth: 0,
  name,
  selected,
  type: 0,
  uri: `/${name}`,
})

test('handleRangeSelection - forward range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: false, type: 0, uri: '/c' },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('handleRangeSelection - backward range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', selected: false, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: false, type: 0, uri: '/c' },
    ],
  }
  expect(() => handleRangeSelection(state, 2, 0)).toThrow(new Error('startIndex must be less than or equal to endIndex'))
})

test('handleRangeSelection - preserve existing selections', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a', selected: true, type: 0, uri: '/a' },
      { depth: 1, name: 'b', selected: false, type: 0, uri: '/b' },
      { depth: 1, name: 'c', selected: true, type: 0, uri: '/c' },
    ],
  }
  const newState = handleRangeSelection(state, 0, 2)
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[2].selected).toBe(true)
})

test('selects items in range', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false), createItem('c', false), createItem('d', false)],
  }

  const newState = handleRangeSelection(state, 1, 2)

  expect(newState.items).toEqual([createItem('a', false), createItem('b', true), createItem('c', true), createItem('d', false)])
})

test('throws error when startIndex > endIndex', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [createItem('a', false), createItem('b', false)],
  }

  expect(() => handleRangeSelection(state, 1, 0)).toThrow('startIndex must be less than or equal to endIndex')
})
