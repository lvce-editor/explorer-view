import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { collapseAll } from '../src/parts/CollapseAll/CollapseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'

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
      { depth: 1, name: 'folder1', selected: false, type: DirentType.Directory, uri: '/folder1' },
      { depth: 2, name: 'file1.txt', selected: false, type: DirentType.File, uri: '/folder1/file1.txt' },
      { depth: 1, name: 'folder2', selected: false, type: DirentType.Directory, uri: '/folder2' },
      { depth: 2, name: 'file2.txt', selected: false, type: DirentType.File, uri: '/folder2/file2.txt' },
    ],
  }

  const result = await collapseAll(state)
  expect(result).toEqual({
    ...state,
    items: [
      { depth: 1, name: 'folder1', selected: false, type: DirentType.Directory, uri: '/folder1' },
      { depth: 1, name: 'folder2', selected: false, type: DirentType.Directory, uri: '/folder2' },
    ],
  })
})

test('collapseAll - resets scroll position', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 200,
    items: [
      { depth: 1, name: 'folder', selected: false, type: DirentType.DirectoryExpanded, uri: '/folder' },
      { depth: 2, name: 'nested', selected: false, type: DirentType.DirectoryExpanded, uri: '/folder/nested' },
    ],
    maxLineY: 12,
    minLineY: 10,
  }

  const result = await collapseAll(state)

  expect(result.deltaY).toBe(0)
  expect(result.minLineY).toBe(0)
})

test('collapseAll - cancels file creation at the folder boundary', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFile,
    editingValue: 'test-file.txt',
    focusedIndex: 0,
    items: [
      { depth: 0, name: '', selected: false, type: DirentType.EditingFile, uri: '/' },
      { depth: 1, name: 'file1.txt', selected: false, type: DirentType.File, uri: '/file1.txt' },
    ],
  }

  const result = await collapseAll(state)

  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(result.editingValue).toBe('')
  expect(result.focusedIndex).toBe(0)
  expect(result.items).toEqual([{ depth: 1, name: 'file1.txt', selected: false, type: DirentType.File, uri: '/file1.txt' }])
})
