import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handlePasteCopy } from '../src/parts/HandlePasteCopy/HandlePasteCopy.ts'
import * as NativeFileTypes from '../src/parts/NativeFileTypes/NativeFileTypes.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('should focus on first newly created file after paste copy', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.copy') {
        return undefined
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'index.js', type: DirentType.File },
          { name: 'index copy.js', type: DirentType.File },
        ]
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return false
      }
      if (method === 'IconTheme.getIcons') {
        return ['', '']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [{ name: 'index.js', type: DirentType.File, path: '/test/index.js', depth: 0, selected: false }],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: ['/source/index.js'],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(2)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/index copy.js')
  expect(result.focused).toBe(true)
})

test('should handle paste copy with multiple files and focus on first', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.copy') {
        return undefined
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'file1.txt', type: DirentType.File },
          { name: 'file1 copy.txt', type: DirentType.File },
          { name: 'file2.txt', type: DirentType.File },
          { name: 'file2 copy.txt', type: DirentType.File },
        ]
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return false
      }
      if (method === 'IconTheme.getIcons') {
        return ['', '', '', '']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/test/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: DirentType.File, path: '/test/file2.txt', depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: ['/source/file1.txt', '/source/file2.txt'],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(4)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/file1 copy.txt')
  expect(result.focused).toBe(true)
})

test('should handle paste copy with empty files array', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return false
      }
      if (method === 'IconTheme.getIcons') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: [],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(0)
})
