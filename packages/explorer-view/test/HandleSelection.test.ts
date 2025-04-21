import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.js'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { handleSelection } from '../src/parts/HandleSelection/HandleSelection.js'

test('handleSelection toggles selection of item at index', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ] as readonly ExplorerItem[],
  }

  const newState = handleSelection(state, 1)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})

test('setSelectedIndices sets selection for given indices', () => {
  const state = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ] as readonly ExplorerItem[],
  }

  const newState = setSelectedIndices(state, [0, 2])
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(true)
})
