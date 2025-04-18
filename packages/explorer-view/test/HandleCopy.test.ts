import { beforeEach, test, expect, jest } from '@jest/globals'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc = {
  invoke: jest.fn(),
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('handleCopy - with focused dirent', async () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 }],
  }

  const result = await handleCopy(state)

  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'copy', ['/test.txt'])
  expect(result).toBe(state)
})

test('handleCopy - without focused dirent', async () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await handleCopy(state)

  expect(mockRpc.invoke).not.toHaveBeenCalled()
  expect(result).toBe(state)
})
