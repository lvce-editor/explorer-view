import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { handleSelection } from '../src/parts/HandleSelection/HandleSelection.js'

test('handleSelection toggles selection of item at index', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 0, name: 'file1', selected: false, type: 0, uri: '/file1' },
      { depth: 0, name: 'file2', selected: false, type: 0, uri: '/file2' },
      { depth: 0, name: 'file3', selected: false, type: 0, uri: '/file3' },
    ],
  }

  const newState = handleSelection(state, 1)
  expect(newState.items[1].selected).toBe(true)
  expect(newState.items[0].selected).toBe(false)
  expect(newState.items[2].selected).toBe(false)
})
