import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handlePaste } from '../src/parts/HandlePaste/HandlePaste.ts'
import * as NativeFileTypes from '../src/parts/NativeFileTypes/NativeFileTypes.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('should handle paste with no files (none type)', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.None,
          files: [],
        }
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBe(initialState)
})

test('should handle paste with copy type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.Copy,
          files: ['/source/file1.txt', '/source/file2.txt'],
        }
      }
      if (method === 'FileSystem.copy') {
        return undefined
      }
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
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
})

test('should handle paste with cut type', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.Cut,
          files: ['/source/file1.txt', '/source/file2.txt'],
        }
      }
      if (method === 'FileSystem.rename') {
        return undefined
      }
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
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
})

test('should handle paste with multiple files', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.Copy,
          files: ['/source/file1.txt', '/source/file2.txt', '/source/folder1', '/source/folder2/file3.txt'],
        }
      }
      if (method === 'FileSystem.copy') {
        return undefined
      }
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
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
})

test('should handle paste with empty files array', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.Copy,
          files: [],
        }
      }
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
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
})

test('should preserve state properties when handling paste', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'ClipBoard.readNativeFiles') {
        return {
          type: NativeFileTypes.Copy,
          files: ['/source/file.txt'],
        }
      }
      if (method === 'FileSystem.copy') {
        return undefined
      }
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
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handlePaste(initialState)

  expect(result).toBeDefined()
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
})
