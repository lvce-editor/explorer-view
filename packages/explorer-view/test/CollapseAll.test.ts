import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { collapseAll } from '../src/parts/CollapseAll/CollapseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('collapseAll - empty state', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await collapseAll(state)
  expect(result).toEqual(state)
})

test('collapseAll - with nested items', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    fileIconCache: {
      '/folder1': 'icon',
      '/folder1/file1.txt': 'icon',
      '/folder2': 'icon',
      '/folder2/file2.txt': 'icon',
    },
    items: [
      { name: 'folder1', type: DirentType.Directory, path: '/folder1', depth: 1, selected: false },
      { name: 'file1.txt', type: DirentType.File, path: '/folder1/file1.txt', depth: 2, selected: false },
      { name: 'folder2', type: DirentType.Directory, path: '/folder2', depth: 1, selected: false },
      { name: 'file2.txt', type: DirentType.File, path: '/folder2/file2.txt', depth: 2, selected: false },
    ],
  }

  const result = await collapseAll(state)
  expect(result).toEqual({
    ...state,
    items: [
      { name: 'folder1', type: DirentType.Directory, path: '/folder1', depth: 1, selected: false },
      { name: 'folder2', type: DirentType.Directory, path: '/folder2', depth: 1, selected: false },
    ],
  })
})
