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
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/new/path'
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
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'Focus.setFocus'() {},
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['Focus.setFocus', 14]]))
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    focusedIndex: 0,
    icons: ['file-icon'],
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    maxLineY: 1,
    fileIconCache: { '/': 'file-icon' },
    items: [
      {
        depth: 0,
        icon: '',
        name: '',
        path: '/',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: 107,
      },
    ],
  })
})

test('newDirent handles directory click when focused item is a directory', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/new/path'
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
    'Focus.setFocus'() {},
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['Focus.setFocus', 14]]))
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: mockEditingType,
    items: [
      { name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false, setSize: 1 },
      {
        depth: 1,
        icon: '',
        name: '',
        path: '/test',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.EditingFile,
      },
    ],
    icons: ['file-icon', 'file-icon'],
    fileIconCache: {
      '/test': 'file-icon',
    },
    editingValue: '',
    focus: 2,
    maxLineY: 2,
  })
})

test('newDirent updates state when focused item is not a directory', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath'() {
      return '/new/path'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'Preferences.get'() {
      return false
    },
    'Focus.setFocus'() {},
    'IconTheme.getIcons'(...params: any[]) {
      return handleFileIcons(params[0])
    },
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['Focus.setFocus', 14]]))
  expect(result).toEqual({
    ...mockState,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
    items: [
      {
        name: 'test.txt',
        type: DirentType.File,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
      {
        depth: 0,
        icon: '',
        name: '',
        path: '/',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.EditingFile,
      },
    ],
    maxLineY: 2,
    fileIconCache: {
      '/': 'file-icon',
      '/test.txt': 'file-icon',
    },
    icons: ['file-icon', 'file-icon'],
  })
})
