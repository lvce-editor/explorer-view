import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { newFolder } from '../src/parts/NewFolder/NewFolder.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('newFolder', async () => {
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
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await newFolder(mockState)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(result).toEqual({
    ...mockState,
    editingIndex: -1,
    editingType: ExplorerEditingType.CreateFolder,
    editingValue: '',
    focus: 2,
  })
})
