import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuMouseAt from '../src/parts/HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockInvoke = jest.fn()
const mockRpc = {
  invoke: mockInvoke,
} as any

test('handleContextMenuMouseAt', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state = {
    ...createDefaultState(),
    uid: 1,
    focusedIndex: 0,
    x: 0,
    y: 0,
    minLineY: 0,
    itemHeight: 20,
  }
  const result = await HandleContextMenuMouseAt.handleContextMenuMouseAt(state, 100, 200)
  expect(mockInvoke).toHaveBeenCalledWith('ContextMenu.show', 100, 200, 4)
  expect(result).toBe(state)
})
