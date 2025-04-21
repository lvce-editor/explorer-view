import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { handleSelection } from '../src/parts/HandleSelection/HandleSelection.js'

test('handleSelection toggles selection of item at index', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ],
  }

  const newState = handleSelection(state, 1)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})
