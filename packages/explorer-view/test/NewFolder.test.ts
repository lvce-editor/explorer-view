import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFolder } from '../src/parts/NewFolder/NewFolder.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

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
  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
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
