import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { removeDirent } from '../src/parts/RemoveDirent/RemoveDirent.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('removeDirent - removes focused item', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('removeDirent - removes multiple selected items', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('removeDirent - removes focused item and selected items', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string) => {
      if (method === 'FileSystem.remove') {
        return
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return ''
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
      { name: 'file3.txt', type: File, path: '/file3.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('remove file', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([{ name: 'folder1', type: DirentType.Directory }])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: Directory, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
    ],
    focusedIndex: 1,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.focusedIndex).toBe(0)
})

test('remove folder with children', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: unknown[]) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/',
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/file1.txt', depth: 1, selected: false },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('remove file from expanded folder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: unknown[]) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        const [path] = args
        if (path === '/') {
          return Promise.resolve([{ name: 'folder1', type: DirentType.Directory }])
        }
        if (path === '/folder1') {
          return Promise.resolve([])
        }
        return Promise.resolve([])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/file1.txt', depth: 1, selected: false },
    ],
    focusedIndex: 1,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.focusedIndex).toBe(0)
})

test.skip('removeDirent - with confirmation enabled and user confirms', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, message?: string) => {
      if (method === 'confirmprompt.prompt') {
        expect(message).toBe('Are you sure you want to delete "/file1.txt"?')
        return Promise.resolve(true)
      }
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('')
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test.skip('removeDirent - with confirmation enabled and user cancels', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, message?: string) => {
      if (method === 'confirmprompt.prompt') {
        expect(message).toBe('Are you sure you want to delete 2 items?')
        return Promise.resolve(false)
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(2)
  expect(result.focusedIndex).toBe(0)
})
