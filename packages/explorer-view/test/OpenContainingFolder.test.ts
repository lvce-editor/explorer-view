import { beforeEach, expect, jest, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { openContainingFolder } from '../src/parts/OpenContainingFolder/OpenContainingFolder.js'
import * as RpcId from '../src/parts/RpcId/RpcId.js'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.js'

const mockRpc = {
  invoke: jest.fn(),
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('openContainingFolder', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: 1, path: '/test.txt', depth: 0 }],
  }
  const result = await openContainingFolder(mockState)
  expect(mockRpc.invoke).toHaveBeenCalledWith('OpenNativeFolder.openNativeFolder', '')
  expect(result).toBe(mockState)
})
