import { test, expect, jest } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreate } from '../src/parts/AcceptCreate/AcceptCreate.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('acceptCreate - empty file name', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingValue: '',
  }

  const result = await acceptCreate(state, DirentType.File, async () => {})
  expect(result).toEqual({
    ...state,
    editingErrorMessage: ExplorerStrings.fileOrFolderNameMustBeProvided(),
  })
})

test('acceptCreate - successful file creation', async () => {
  const invoke = jest.fn((method: string): any => {
    if (method === 'FileSystem.getPathSeparator') {
      return '/'
    }
    if (method === 'IconTheme.getFileIcon') {
      return ''
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
    editingValue: 'test.txt',
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 }],
    minLineY: 0,
    height: 100,
    itemHeight: 20,
    fileIconCache: {},
  }

  const createFn = async (path: string) => {
    // The actual file creation is handled by the RPC
    // This is just a mock that simulates the file being created
  }

  const result = await acceptCreate(state, DirentType.File, createFn)
  expect(result).toEqual({
    ...state,
    items: [
      { name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 },
      { name: 'test.txt', type: DirentType.File, path: '/test.txt/test.txt', depth: 1, posInSet: 1, setSize: 1, icon: '' },
    ],
    editingIndex: -1,
    focusedIndex: 1,
    editingType: ExplorerEditingType.None,
    maxLineY: 2,
    focus: FocusId.List,
    icons: ['', ''],
    fileIconCache: {
      '/test.txt': '',
      '/test.txt/test.txt': '',
    },
  })
})
