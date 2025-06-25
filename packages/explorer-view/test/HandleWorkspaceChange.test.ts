import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('should update state with new workspace path and load content', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'Workspace.getPath') {
        return '/new/workspace/path'
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
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/new/workspace/path')
  expect(result).toHaveProperty('items')
  expect(result).toHaveProperty('icons')
  expect(result).toHaveProperty('fileIconCache')
  expect(result).toHaveProperty('minLineY')
  expect(result).toHaveProperty('deltaY')
  expect(result).toHaveProperty('maxLineY')
  expect(result).toHaveProperty('pathSeparator')
  expect(result).toHaveProperty('excluded')
  expect(result).toHaveProperty('useChevrons')
})

test('should preserve state properties when updating workspace', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'Workspace.getPath') {
        return '/another/workspace'
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return true
      }
      if (method === 'IconTheme.getIcons') {
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.uid).toBe(initialState.uid)
  expect(result.parentUid).toBe(initialState.parentUid)
  expect(result.focusedIndex).toBe(initialState.focusedIndex)
  expect(result.focused).toBe(initialState.focused)
  expect(result.hoverIndex).toBe(initialState.hoverIndex)
  expect(result.x).toBe(initialState.x)
  expect(result.y).toBe(initialState.y)
  expect(result.width).toBe(initialState.width)
  expect(result.height).toBe(initialState.height)
  expect(result.version).toBe(initialState.version)
  expect(result.editingIndex).toBe(initialState.editingIndex)
  expect(result.itemHeight).toBe(initialState.itemHeight)
  expect(result.platform).toBe(initialState.platform)
  expect(result.focus).toBe(initialState.focus)
  expect(result.inputSource).toBe(initialState.inputSource)
  expect(result.focusWord).toBe(initialState.focusWord)
  expect(result.focusWordTimeout).toBe(initialState.focusWordTimeout)
  expect(result.finalDeltaY).toBe(initialState.finalDeltaY)
  expect(result.scrollBarHeight).toBe(initialState.scrollBarHeight)
  expect(result.handleOffset).toBe(initialState.handleOffset)
  expect(result.scrollBarActive).toBe(initialState.scrollBarActive)
})

test('should handle workspace path change with existing content', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'Workspace.getPath') {
        return '/changed/workspace/path'
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'file1.txt', isFile: true, isDirectory: false },
          { name: 'folder1', isFile: false, isDirectory: true },
        ]
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return false
      }
      if (method === 'IconTheme.getIcons') {
        return ['file-icon', 'folder-icon']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/changed/workspace/path')
  expect(result.items).toHaveLength(2)
  expect(result.icons).toHaveLength(2)
  expect(result.pathSeparator).toBe('/')
  expect(result.useChevrons).toBe(false)
})

test('should handle workspace path change with chevrons enabled', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'Workspace.getPath') {
        return '/chevron/workspace'
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '/'
      }
      if (method === 'Preferences.get') {
        return true
      }
      if (method === 'IconTheme.getIcons') {
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/chevron/workspace')
  expect(result.useChevrons).toBe(true)
})

test('should handle different path separators', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'Workspace.getPath') {
        return 'C:\\windows\\workspace'
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystem.getPathSeparator') {
        return '\\'
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
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('C:\\windows\\workspace')
  expect(result.pathSeparator).toBe('\\')
})
