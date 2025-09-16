import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'

const handleFileIcons = (requests: readonly any[]): readonly string[] => {
  return requests.map((param) => {
    if (param.type === 2) {
      return `folder-icon`
    }
    return `file-icon`
  })
}

const invoke = (method: string, ...params: readonly any[]): any => {
  if (method === 'Workspace.getPath') {
    return '/new/path'
  }
  if (method === 'FileSystem.readDirWithFileTypes') {
    return []
  }
  if (method === 'FileSystem.getPathSeparator') {
    return '/'
  }
  if (method === 'IconTheme.getFileIcon') {
    return ''
  }
  if (method === 'IconTheme.getFolderIcon') {
    return ''
  }
  if (method === 'Preferences.get') {
    return false
  }
  if (method === 'Focus.setFocus') {
    return undefined
  }
  if (method === 'IconTheme.getIcons') {
    return handleFileIcons(params[0])
  }
  throw new Error(`unexpected method ${method}`)
}

test('newFile', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getPath': invoke.bind(undefined, 'Workspace.getPath'),
    'FileSystem.readDirWithFileTypes': invoke.bind(undefined, 'FileSystem.readDirWithFileTypes'),
    'FileSystem.getPathSeparator': invoke.bind(undefined, 'FileSystem.getPathSeparator'),
    'IconTheme.getFileIcon': invoke.bind(undefined, 'IconTheme.getFileIcon'),
    'IconTheme.getFolderIcon': invoke.bind(undefined, 'IconTheme.getFolderIcon'),
    'Preferences.get': invoke.bind(undefined, 'Preferences.get'),
    'Focus.setFocus': invoke.bind(undefined, 'Focus.setFocus'),
    'IconTheme.getIcons': invoke.bind(undefined, 'IconTheme.getIcons'),
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'testfolder', type: DirentType.Directory, path: '/testfolder', depth: 0, selected: false }],
    maxLineY: 1,
  }

  const result = await newFile(state)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    visibleExplorerItems: expect.anything(),
    items: [
      {
        depth: 0,
        name: 'testfolder',
        path: '/testfolder',
        selected: false,
        type: 3,
        setSize: 1,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        type: DirentType.EditingFile,
        path: '/testfolder',
        selected: false,
        posInSet: 1,
        setSize: 2,
      },
    ],
    editingValue: '',
    focus: 2,
  })
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/testfolder']])
})
