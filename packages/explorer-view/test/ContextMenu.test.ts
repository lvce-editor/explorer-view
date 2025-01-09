import { expect, test, beforeEach, jest } from '@jest/globals'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockInvoke = jest.fn()
const mockRpc = {
  invoke: mockInvoke,
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('show', async () => {
  const x = 100
  const y = 200
  const id = 1
  const args = ['arg1', 'arg2']
  await ContextMenu.show(x, y, id, ...args)
  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('ContextMenu.show', x, y, id, ...args)
})
