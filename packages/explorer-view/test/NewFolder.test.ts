import { expect, test } from '@jest/globals'
import { RendererWorker, IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFolder } from '../src/parts/NewFolder/NewFolder.ts'

const invoke = (method: string): any => {
  if (method === 'Workspace.getPath') {
    return '/new/path'
  }
  if (method === 'FileSystem.readDirWithFileTypes') {
    return []
  }
  if (method === 'FileSystem.getPathSeparator') {
    return '/'
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
    return ['']
  }
  throw new Error(`unexpected method ${method}`)
}

test('newFolder', async () => {
  RendererWorker.registerMockRpc({
    'Workspace.getPath': invoke.bind(undefined, 'Workspace.getPath'),
    'FileSystem.readDirWithFileTypes': invoke.bind(undefined, 'FileSystem.readDirWithFileTypes'),
    'FileSystem.getPathSeparator': invoke.bind(undefined, 'FileSystem.getPathSeparator'),
    'Preferences.get': invoke.bind(undefined, 'Preferences.get'),
    'Focus.setFocus': invoke.bind(undefined, 'Focus.setFocus'),
  })

  IconThemeWorker.registerMockRpc({
    'IconTheme.getFolderIcon': invoke.bind(undefined, 'IconTheme.getFolderIcon'),
    'IconTheme.getIcons': invoke.bind(undefined, 'IconTheme.getIcons'),
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await newFolder(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: '',
    focus: 2,
    fileIconCache: { '/': '' },
    focusedIndex: 0,
    maxLineY: 1,
    icons: [''],
    items: [
      {
        depth: 0,
        icon: '',
        name: '',
        path: '/',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: 103,
      },
    ],
  })
})
