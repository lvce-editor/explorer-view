import { test, expect, jest } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('newFile', async () => {
  const invoke = jest.fn((method: string): any => {
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
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = await MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
    maxLineY: 1,
  }

  const result = await newFile(state)
  expect(result).toEqual({
    ...state,
    editingIndex: 1,
    focusedIndex: 1,
    editingType: ExplorerEditingType.CreateFile,
    items: [
      {
        depth: 0,
        name: 'test.txt',
        path: '/test.txt',
        selected: false,
        setSize: 1,
        type: 7,
      },
      {
        depth: 1,
        icon: '',
        name: '',
        type: DirentType.EditingFile,
        path: '/test.txt',
        selected: false,
        posInSet: 1,
        setSize: 2,
      },
    ],
    editingValue: '',
    focus: 2,
    maxLineY: 2,
    icons: ['', ''],
    fileIconCache: {
      '/test.txt': '',
    },
  })
})
