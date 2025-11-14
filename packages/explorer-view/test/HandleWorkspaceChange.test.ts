import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'

test('should update state with new workspace path and load content', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/new/workspace/path'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

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
  expect(mockRpc.invocations).toEqual([
    ['Workspace.getPath'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Workspace.getPath'],
    ['FileSystem.getPathSeparator', '/new/workspace/path'],
    ['FileSystem.readDirWithFileTypes', '/new/workspace/path'],
  ])
})

test('should preserve state properties when updating workspace', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/another/workspace'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return true
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

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
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/another/workspace'],
      ['FileSystem.readDirWithFileTypes', '/another/workspace'],
    ]),
  )
})

test('should handle workspace path change with existing content', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/changed/workspace/path'
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1.txt', isFile: true, isDirectory: false },
        { name: 'folder1', isFile: false, isDirectory: true },
      ]
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['file-icon', 'folder-icon']
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/changed/workspace/path')
  expect(result.items).toHaveLength(2)
  expect(result.pathSeparator).toBe('/')
  expect(result.useChevrons).toBe(false)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/changed/workspace/path'],
      ['FileSystem.readDirWithFileTypes', '/changed/workspace/path'],
    ]),
  )
})

test('should handle workspace path change with chevrons enabled', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/chevron/workspace'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return true
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('/chevron/workspace')
  expect(result.useChevrons).toBe(true)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', '/chevron/workspace'],
      ['FileSystem.readDirWithFileTypes', '/chevron/workspace'],
    ]),
  )
})

test('should handle different path separators', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return 'C:\\windows\\workspace'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '\\'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('C:\\windows\\workspace')
  expect(result.pathSeparator).toBe('\\')
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getPath'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Workspace.getPath'],
      ['FileSystem.getPathSeparator', 'C:\\windows\\workspace'],
      ['FileSystem.readDirWithFileTypes', 'C:\\windows\\workspace'],
    ]),
  )
})
