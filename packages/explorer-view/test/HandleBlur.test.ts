import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const invoke = (method: string, ...params: readonly any[]): any => {
  if (method === 'FileSystem.getPathSeparator') {
    return '/'
  }
  if (method === 'FileSystem.writeFile') {
    return
  }
  if (method === 'IconTheme.getFileIcon') {
    return ''
  }
  if (method === 'IconTheme.getIcons') {
    return Array(params[0].length).fill('')
  }
  throw new Error(`unexpected method ${method}`)
}

test('handleBlur - when not editing, sets focused to false', async () => {
  const state: ExplorerState = createDefaultState()
  const newState = await handleBlur(state)
  expect(newState.focused).toBe(false)
})

test.skip('handleBlur - when editing, keeps state unchanged', async () => {
  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFile,
    editingIndex: 0,
    items: [
      {
        type: DirentType.File,
        depth: 0,
        name: '1',
        path: '1',
        selected: false,
      },
    ],
    editingValue: 'created.txt',
  }
  const newState = await handleBlur(state)
  expect(newState).toEqual({
    ...state,
    editingIndex: -1,
    editingType: 0,
    fileIconCache: {
      '1': '',
      '1/created.txt': '',
    },
    focus: 1,
    focusedIndex: 1,
    icons: ['', ''],
    maxLineY: 2,
  })
})
