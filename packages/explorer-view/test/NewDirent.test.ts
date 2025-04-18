import { beforeEach, expect, jest, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as HandleClickDirectory from '../src/parts/HandleClickDirectory/HandleClickDirectory.js'
import { newDirent } from '../src/parts/NewDirent/NewDirent.js'
import * as RpcId from '../src/parts/RpcId/RpcId.js'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.js'

const mockRpc = {
  invoke: jest.fn(),
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('newDirent sets focus and updates state when no item is focused', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(result).toEqual({
    ...mockState,
    editingIndex: -1,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
  })
})

test.skip('newDirent handles directory click when focused item is a directory', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0 }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 14)
  expect(HandleClickDirectory.handleClickDirectory).toHaveBeenCalledWith(mockState, mockState.items[0], 0)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
  })
})

test.skip('newDirent updates state when focused item is not a directory', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 }],
  }
  const mockEditingType = 1

  const result = await newDirent(mockState, mockEditingType)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Focus.setFocus', 'explorer-edit-box')
  expect(HandleClickDirectory.handleClickDirectory).not.toHaveBeenCalled()
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: mockEditingType,
    editingValue: '',
    focus: 2,
  })
})
