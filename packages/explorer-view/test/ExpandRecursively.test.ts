import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import { expandRecursively } from '../src/parts/ExpandRecursively/ExpandRecursively.ts'

test('expandRecursively - expands root when no item is focused', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace') {
        return [
          { name: 'README.md', type: File },
          { name: 'src', type: Directory },
        ]
      }
      if (path === '/workspace/src') {
        return [{ name: 'index.ts', type: File }]
      }
      throw new Error(`unexpected read ${path}`)
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    root: '/workspace',
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toEqual([
    { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 2, type: DirectoryExpanded, uri: '/workspace/src' },
    { depth: 2, name: 'index.ts', posInSet: 1, selected: false, setSize: 1, type: File, uri: '/workspace/src/index.ts' },
    { depth: 1, name: 'README.md', posInSet: 2, selected: false, setSize: 2, type: File, uri: '/workspace/README.md' },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/workspace'],
    ['FileSystem.readDirWithFileTypes', '/workspace/src'],
  ])
})

test('expandRecursively - replaces focused directory children', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/workspace/src') {
        return [{ name: 'index.ts', type: File }]
      }
      throw new Error(`unexpected read ${path}`)
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 2, type: Directory, uri: '/workspace/src' },
      { depth: 2, name: 'old.ts', posInSet: 1, selected: false, setSize: 1, type: File, uri: '/workspace/src/old.ts' },
      { depth: 1, name: 'README.md', posInSet: 2, selected: false, setSize: 2, type: File, uri: '/workspace/README.md' },
    ],
    root: '/workspace',
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toEqual([
    { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 2, type: DirectoryExpanded, uri: '/workspace/src' },
    { depth: 2, name: 'index.ts', posInSet: 1, selected: false, setSize: 1, type: File, uri: '/workspace/src/index.ts' },
    { depth: 1, name: 'README.md', posInSet: 2, selected: false, setSize: 2, type: File, uri: '/workspace/README.md' },
  ])
})

test.skip('expand root directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isSymbolicLink: false, name: 'file1.txt', type: 'file' },
        { isSymbolicLink: false, name: 'dir1', type: 'directory' },
      ]
    },
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', selected: false, type: File, uri: '/test/file1.txt' },
      { depth: 0, name: 'dir1', selected: false, type: Directory, uri: '/test/dir1' },
    ],
    root: '/test',
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('dir1')
  expect(mockRpc.invocations).toEqual([])
})

test.skip('expand focused directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isSymbolicLink: false, name: 'file1.txt', type: 'file' },
        { isSymbolicLink: false, name: 'file2.txt', type: 'file' },
      ]
    },
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'dir1', selected: false, type: Directory, uri: '/test/dir1' },
      { depth: 0, name: 'file1.txt', selected: false, type: File, uri: '/test/file1.txt' },
    ],
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(2)
  expect(newState.items[0].name).toBe('file1.txt')
  expect(newState.items[1].name).toBe('file2.txt')
  expect(mockRpc.invocations).toEqual([])
})

test('do not expand file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        selected: false,
        type: File,
        uri: '/test.txt',
      },
    ],
  }
  const newState = await expandRecursively(state)
  expect(newState.items).toHaveLength(1)
  expect(newState.items[0].type).toBe(File)
})
