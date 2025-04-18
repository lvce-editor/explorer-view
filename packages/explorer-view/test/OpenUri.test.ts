import { beforeEach, expect, jest, test } from '@jest/globals'
import { openUri } from '../src/parts/OpenUri/OpenUri.js'
import * as RpcId from '../src/parts/RpcId/RpcId.js'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.js'

const mockRpc = {
  invoke: jest.fn(),
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('openUri calls ParentRpc.invoke with correct parameters', async () => {
  const mockUri = 'file:///test.txt'
  const mockFocus = true
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})

test('openUri calls ParentRpc.invoke with focus false', async () => {
  const mockUri = 'file:///test.txt'
  const mockFocus = false
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})
