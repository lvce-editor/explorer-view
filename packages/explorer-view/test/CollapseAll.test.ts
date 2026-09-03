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
      { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory },
      { depth: 2, name: 'file1.txt', path: '/folder1/file1.txt', selected: false, type: DirentType.File },
      { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: DirentType.Directory },
      { depth: 2, name: 'file2.txt', path: '/folder2/file2.txt', selected: false, type: DirentType.File },
    ],
  }

  const result = await collapseAll(state)
  expect(result).toEqual({
    ...state,
    items: [
      { depth: 1, name: 'folder1', path: '/folder1', selected: false, type: DirentType.Directory },
      { depth: 1, name: 'folder2', path: '/folder2', selected: false, type: DirentType.Directory },
    ],
  })
})

test('collapseAll - resets scroll position', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 200,
    items: [
      { depth: 1, name: 'folder', path: '/folder', selected: false, type: DirentType.DirectoryExpanded },
      { depth: 2, name: 'nested', path: '/folder/nested', selected: false, type: DirentType.DirectoryExpanded },
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
      { depth: 0, name: '', path: '/', selected: false, type: DirentType.EditingFile },
      { depth: 1, name: 'file1.txt', path: '/file1.txt', selected: false, type: DirentType.File },
    ],
  }

  const result = await collapseAll(state)

  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(result.editingValue).toBe('')
  expect(result.focusedIndex).toBe(0)
  expect(result.items).toEqual([{ depth: 1, name: 'file1.txt', path: '/file1.txt', selected: false, type: DirentType.File }])
})
