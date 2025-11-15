import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RpcRegistry, RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptRename } from '../src/parts/AcceptRename/AcceptRename.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test.skip('acceptRename - basic file rename', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'c.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'a.txt', type: DirentType.File, path: '/test/a.txt', depth: 0, selected: false },
      { name: 'c.txt', type: DirentType.File, path: '/test/c.txt', depth: 0, selected: false },
    ],
    editingIndex: 0,
    editingValue: 'b.txt',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('b.txt')
  expect(result.items[0].path).toBe('/test/b.txt')
  expect(result.items[1].name).toBe('c.txt')
  expect(result.focusedIndex).toBe(0)
  expect(result.editingIndex).toBe(-1)
  expect(result.editingType).toBe(ExplorerEditingType.None)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/a.txt', '/test/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

<<<<<<< HEAD
test('acceptRename - folder rename', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'folder2', type: DirentType.Directory },
          { name: 'file.txt', type: DirentType.File },
        ]
      }
      if (method === 'FileSystem.rename') {
        return
      }
      throw new Error(`unexpected method ${method}`)
=======
test.skip('acceptRename - folder rename', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'folder2', type: DirentType.Directory },
        { name: 'file.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
>>>>>>> origin/main
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirentType.Directory, path: '/test/folder1', depth: 0, selected: false },
      { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false },
    ],
    editingIndex: 0,
    editingValue: 'folder2',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('folder2')
  expect(result.items[0].path).toBe('/test/folder2')
  expect(result.items[1].name).toBe('file.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder1', '/test/folder2'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

<<<<<<< HEAD
test('acceptRename - nested file rename', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'b.txt', type: DirentType.File },
          { name: 'c.txt', type: DirentType.File },
        ]
      }
      if (method === 'FileSystem.rename') {
        return
      }
      throw new Error(`unexpected method ${method}`)
=======
test.skip('acceptRename - nested file rename', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'c.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
>>>>>>> origin/main
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false },
      { name: 'a.txt', type: DirentType.File, path: '/test/folder/a.txt', depth: 1, selected: false },
      { name: 'c.txt', type: DirentType.File, path: '/test/folder/c.txt', depth: 1, selected: false },
    ],
    editingIndex: 1,
    editingValue: 'b.txt',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder')
  expect(result.items[1].name).toBe('b.txt')
  expect(result.items[1].path).toBe('/test/folder/b.txt')
  expect(result.items[2].name).toBe('c.txt')
  expect(result.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder/a.txt', '/test/folder/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test/folder'],
    ]),
  )
})

<<<<<<< HEAD
test('acceptRename - preserves nested items', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [{ name: 'folder2', type: DirentType.Directory }]
      }
      if (method === 'FileSystem.rename') {
        return
      }
      throw new Error(`unexpected method ${method}`)
=======
test.skip('acceptRename - preserves nested items', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'folder2', type: DirentType.Directory }]
    },
    'FileSystem.rename'() {
      return
>>>>>>> origin/main
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirentType.Directory, path: '/test/folder1', depth: 0, selected: false },
      { name: 'nested.txt', type: DirentType.File, path: '/test/folder1/nested.txt', depth: 1, selected: false },
    ],
    editingIndex: 0,
    editingValue: 'folder2',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('folder2')
  expect(result.items[0].path).toBe('/test/folder2')
  expect(result.items[1].name).toBe('nested.txt')
  expect(result.items[1].path).toBe('/test/folder2/nested.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/folder1', '/test/folder2'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})

<<<<<<< HEAD
test('acceptRename - handles rename error', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.rename') {
        throw new Error('rename failed')
      }
      throw new Error(`unexpected method ${method}`)
=======
test.skip('acceptRename - handles rename error', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.rename'() {
      return Promise.reject(new Error('rename failed'))
>>>>>>> origin/main
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'a.txt', type: DirentType.File, path: '/test/a.txt', depth: 0, selected: false }],
    editingIndex: 0,
    editingValue: 'b.txt',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['FileSystem.rename', '/test/a.txt', '/test/b.txt']])
})

<<<<<<< HEAD
test('acceptRename - maintains sorting order', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'b.txt', type: DirentType.File },
          { name: 'folder', type: DirentType.Directory },
          { name: 'z.txt', type: DirentType.File },
        ]
      }
      if (method === 'FileSystem.rename') {
        return
      }
      throw new Error(`unexpected method ${method}`)
=======
test.skip('acceptRename - maintains sorting order', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'b.txt', type: DirentType.File },
        { name: 'folder', type: DirentType.Directory },
        { name: 'z.txt', type: DirentType.File },
      ]
    },
    'FileSystem.rename'() {
      return
>>>>>>> origin/main
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'a.txt', type: DirentType.File, path: '/test/a.txt', depth: 0, selected: false },
      { name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false },
      { name: 'z.txt', type: DirentType.File, path: '/test/z.txt', depth: 0, selected: false },
    ],
    editingIndex: 0,
    editingValue: 'b.txt',
    editingType: ExplorerEditingType.Rename,
    pathSeparator: PathSeparatorType.Slash,
  }

  const result = await acceptRename(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('b.txt')
  expect(result.items[1].name).toBe('folder')
  expect(result.items[2].name).toBe('z.txt')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['FileSystem.rename', '/test/a.txt', '/test/b.txt'],
      ['FileSystem.readDirWithFileTypes', '/test'],
    ]),
  )
})
