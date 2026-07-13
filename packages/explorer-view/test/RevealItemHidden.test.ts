import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { revealItemHidden } from '../src/parts/RevealItemHidden/RevealItemHidden.ts'

test('revealItemHidden - reveals hidden item', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/root') {
        return [{ isDirectory: true, name: 'folder1', path: '/root/folder1', type: DirentType.File }]
      }
      if (path === '/root/folder1') {
        return [
          { isDirectory: false, name: 'file1.txt', path: '/root/folder1/file1.txt', type: DirentType.File },
          { isDirectory: false, name: 'file2.txt', path: '/root/folder1/file2.txt', type: DirentType.File },
        ]
      }
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/root',
  }
  const newState = await revealItemHidden(state, '/root/folder1/file1.txt')
  expect(newState.items.length).toBeGreaterThan(0)
  expect(newState.focused).toBe(true)
  expect(newState.focusedIndex).toBeGreaterThanOrEqual(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/root'],
    ['FileSystem.readDirWithFileTypes', '/root/folder1'],
  ])
})

test('revealItemHidden - expands visible ancestor folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/root/folder1') {
        return [{ name: 'file1.txt', type: DirentType.File }]
      }
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        depth: 1,
        name: 'folder1',
        path: '/root/folder1',
        selected: false,
        type: DirentType.Directory,
      },
    ],
    root: '/root',
  }
  const newState = await revealItemHidden(state, '/root/folder1/file1.txt')
  expect(newState.items[0].type).toBe(DirentType.DirectoryExpanded)
  expect(newState.items[1].path).toBe('/root/folder1/file1.txt')
  expect(newState.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/root/folder1']])
})

test('revealItemHidden - inserts revealed descendants before the next visible sibling', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/root/folder1') {
        return [{ name: 'nested', type: DirentType.Directory }]
      }
      if (path === '/root/folder1/nested') {
        return [{ name: 'file1.txt', type: DirentType.File }]
      }
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        depth: 1,
        name: 'folder1',
        path: '/root/folder1',
        selected: false,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        name: 'sibling.txt',
        path: '/root/sibling.txt',
        selected: false,
        type: DirentType.File,
      },
    ],
    root: '/root',
  }
  const newState = await revealItemHidden(state, '/root/folder1/nested/file1.txt')
  expect(newState.items.map((item) => item.path)).toEqual([
    '/root/folder1',
    '/root/folder1/nested',
    '/root/folder1/nested/file1.txt',
    '/root/sibling.txt',
  ])
  expect(newState.focusedIndex).toBe(2)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/root/folder1'],
    ['FileSystem.readDirWithFileTypes', '/root/folder1/nested'],
  ])
})

test('revealItemHidden - returns same state for empty path parts', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createDefaultState()
  const newState = await revealItemHidden(state, '')
  expect(newState).toEqual(state)
  expect(mockRpc.invocations).toEqual([])
})

test('revealItemHidden - throws error for non-existent file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })
  const state = createDefaultState()
  await expect(revealItemHidden(state, '/non/existent/file.txt')).rejects.toThrow('File not found in explorer')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/non'],
    ['FileSystem.readDirWithFileTypes', '/non/existent'],
  ])
})
