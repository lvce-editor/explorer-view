import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { newDirent } from '../src/parts/NewDirent/NewDirent.ts'

const handleFileIcons = (requests: readonly any[]): readonly string[] => {
  return requests.map((param) => {
    if (param.type === 2) {
      return `folder-icon`
    }
    return `file-icon`
  })
}

test('newDirent sets focus and updates state when no item is focused', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {},
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///new/path'
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
    root: 'file:///new/path',
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingSessionId: 1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    focusedIndex: 0,
    items: [
      {
        depth: 0,
        name: '',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: 107,
        uri: 'file:///new/path',
      },
    ],
  })
})

test('newDirent handles directory click when focused item is a directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {},
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///new/path'
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/test']])
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    editingSessionId: 1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'test', selected: false, setSize: 1, type: DirentType.DirectoryExpanded, uri: '/test' },
      {
        depth: 1,
        name: '',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
        uri: '/test',
      },
    ],
    visibleExplorerItems: expect.anything(),
  })
})

test('newDirent updates state when focused item is not a directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {},
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///new/path'
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
    root: 'file:///new/path',
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    editingSessionId: 1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    focusedIndex: 1,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        selected: false,
        type: DirentType.File,
        uri: '/test.txt',
      },
      {
        depth: 0,
        name: '',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFile,
        uri: 'file:///new/path',
      },
    ],
    visibleExplorerItems: expect.anything(),
  })
})

test('newDirent expands a closed folder when creating a file inside it', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'Focus.setFocus'() {},
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
    'Preferences.get'() {
      return false
    },
    'Workspace.getUri'() {
      return 'file:///new/path'
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'folder', selected: false, type: DirentType.Directory, uri: '/folder' }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/folder']])
  // The folder should be expanded (type changed to DirectoryExpanded)
  expect(result.items[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result.editingIndex).toBe(1)
  expect(result.items[1].type).toBe(DirentType.EditingFile)
})
