import { test, expect } from '@jest/globals'
import { RendererWorker, SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'

test('should update state with new workspace path and load content', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///new/workspace/path'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('file:///new/workspace/path')
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
    ['Workspace.getUri'],
    ['Preferences.get', 'explorer.useChevrons'],
    ['Preferences.get', 'explorer.confirmdelete'],
    ['Preferences.get', 'explorer.confirmpaste'],
    ['Preferences.get', 'files.exclude'],
    ['Preferences.get', 'explorer.gitIgnoreDecorations'],
    ['Preferences.get', 'explorer.preserveExpandState'],
    ['Preferences.get', 'explorer.sourceControlDecorations'],
    ['Workspace.getUri'],
    ['FileSystem.isReadonly', 'file:///new/workspace/path'],
    ['FileSystem.readDirWithFileTypes', 'file:///new/workspace/path'],
  ])
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should restore saved state for the new workspace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === 'file:///restored/workspace') {
        return [{ isDirectory: true, isFile: false, name: 'src' }]
      }
      if (path === 'file:///restored/workspace/src') {
        return [{ isDirectory: false, isFile: true, name: 'index.ts' }]
      }
      return []
    },
    'Preferences.get'(key: string) {
      return key === 'explorer.preserveExpandState'
    },
    'Workspace.getUri'() {
      return 'file:///restored/workspace'
    },
  })

  SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const savedState = {
    deltaY: 0,
    expandedPaths: ['file:///restored/workspace/src'],
    root: 'file:///restored/workspace',
  }
  const result = await handleWorkspaceChange(initialState, 'file:///restored/workspace', savedState)

  expect(result.root).toBe('file:///restored/workspace')
  expect(result.expandedPaths).toEqual(['file:///restored/workspace/src'])
  expect(result.preserveExpandState).toBe(true)
  expect(result.items.map((item) => item.path)).toContain('file:///restored/workspace/src')
  expect(mockRpc.invocations).toContainEqual(['FileSystem.readDirWithFileTypes', 'file:///restored/workspace'])
  expect(mockRpc.invocations).toContainEqual(['FileSystem.readDirWithFileTypes', 'file:///restored/workspace/src'])
})

test('should preserve state properties when updating workspace', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return true
    },
    'Workspace.getUri'() {
      return 'file:///another/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
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
      ['Workspace.getUri'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'files.exclude'],
      ['Preferences.get', 'explorer.gitIgnoreDecorations'],
      ['Preferences.get', 'explorer.preserveExpandState'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getUri'],
      ['FileSystem.isReadonly', 'file:///another/workspace'],
      ['FileSystem.readDirWithFileTypes', 'file:///another/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', '', 'file:///another/workspace', '', 0]])
})

test('should handle workspace path change with existing content', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { isDirectory: false, isFile: true, name: 'file1.txt' },
        { isDirectory: true, isFile: false, name: 'folder1' },
      ]
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///changed/workspace/path'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('file:///changed/workspace/path')
  expect(result.items).toHaveLength(2)
  expect(result.pathSeparator).toBe('/')
  expect(result.useChevrons).toBe(false)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getUri'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'files.exclude'],
      ['Preferences.get', 'explorer.gitIgnoreDecorations'],
      ['Preferences.get', 'explorer.preserveExpandState'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getUri'],
      ['FileSystem.isReadonly', 'file:///changed/workspace/path'],
      ['FileSystem.readDirWithFileTypes', 'file:///changed/workspace/path'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should handle workspace path change with chevrons enabled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return true
    },
    'Workspace.getUri'() {
      return 'file:///chevron/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('file:///chevron/workspace')
  expect(result.useChevrons).toBe(true)
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getUri'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'files.exclude'],
      ['Preferences.get', 'explorer.gitIgnoreDecorations'],
      ['Preferences.get', 'explorer.preserveExpandState'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getUri'],
      ['FileSystem.isReadonly', 'file:///chevron/workspace'],
      ['FileSystem.readDirWithFileTypes', 'file:///chevron/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', '', 'file:///chevron/workspace', '', 0]])
})

test('should always use slash for URI paths', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///C:/windows/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('file:///C:/windows/workspace')
  expect(result.pathSeparator).toBe('/')
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getUri'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'files.exclude'],
      ['Preferences.get', 'explorer.gitIgnoreDecorations'],
      ['Preferences.get', 'explorer.preserveExpandState'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getUri'],
      ['FileSystem.isReadonly', 'file:///C:/windows/workspace'],
      ['FileSystem.readDirWithFileTypes', 'file:///C:/windows/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})

test('should set load error state when reading folder fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly'() {
      return false
    },
    'FileSystem.readDirWithFileTypes'() {
      const error = Object.assign(new Error('Permission denied'), {
        code: 'EACCES',
      })
      throw error
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///restricted/workspace'
    },
  })

  const mockSourceControlRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const initialState: ExplorerState = createDefaultState()
  const result = await handleWorkspaceChange(initialState)

  expect(result.root).toBe('file:///restricted/workspace')
  expect(result.hasError).toBe(true)
  expect(result.errorCode).toBe('EACCES')
  expect(result.errorMessage).toBe('permission was denied')
  expect(result.items).toEqual([])
  expect(mockRpc.invocations).toEqual(
    expect.arrayContaining([
      ['Workspace.getUri'],
      ['Preferences.get', 'explorer.useChevrons'],
      ['Preferences.get', 'explorer.confirmdelete'],
      ['Preferences.get', 'explorer.confirmpaste'],
      ['Preferences.get', 'files.exclude'],
      ['Preferences.get', 'explorer.gitIgnoreDecorations'],
      ['Preferences.get', 'explorer.preserveExpandState'],
      ['Preferences.get', 'explorer.sourceControlDecorations'],
      ['Workspace.getUri'],
      ['FileSystem.isReadonly', 'file:///restricted/workspace'],
      ['FileSystem.readDirWithFileTypes', 'file:///restricted/workspace'],
    ]),
  )
  expect(mockSourceControlRpc.invocations).toEqual([])
})
