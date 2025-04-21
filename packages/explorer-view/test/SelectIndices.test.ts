import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { setSelectedIndices } from '../src/parts/SelectIndices/SelectIndices.js'

test('setSelectedIndices sets selection for given indices', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1', type: 0, path: '/file1', depth: 0, selected: false },
      { name: 'file2', type: 0, path: '/file2', depth: 0, selected: false },
      { name: 'file3', type: 0, path: '/file3', depth: 0, selected: false },
    ],
  }

  const newState = setSelectedIndices(state, [0, 2])
  expect(newState.items[0].selected).toBe(true)
  expect(newState.items[1].selected).toBe(false)
  expect(newState.items[2].selected).toBe(true)
})
