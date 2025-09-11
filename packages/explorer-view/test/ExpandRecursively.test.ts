import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, File } from '../src/parts/DirentType/DirentType.ts'
import { expandRecursively } from '../src/parts/ExpandRecursively/ExpandRecursively.ts'

test.skip('expand root directory', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1.txt', type: 'file', isSymbolicLink: false },
        { name: 'dir1', type: 'directory', isSymbolicLink: false },
      ]
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [
      { name: 'file1.txt', type: File, depth: 0, path: '/test/file1.txt', selected: false },
      { name: 'dir1', type: Directory, depth: 0, path: '/test/dir1', selected: false },
    ],
    focusedIndex: 0,
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('dir1')
})

test.skip('expand focused directory', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1.txt', type: 'file', isSymbolicLink: false },
        { name: 'file2.txt', type: 'file', isSymbolicLink: false },
      ]
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'dir1', type: Directory, depth: 0, path: '/test/dir1', selected: false },
      { name: 'file1.txt', type: File, depth: 0, path: '/test/file1.txt', selected: false },
    ],
    focusedIndex: 0,
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('file2.txt')
})

test('do not expand file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        name: 'test.txt',
        type: File,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
    ],
    focusedIndex: 0,
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(1)
  expect(newState.items[0].type).toBe(File)
})
