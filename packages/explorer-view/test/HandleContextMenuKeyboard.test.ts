import { test, expect, jest } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuKeyboard from '../src/parts/HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockInvoke = jest.fn()
const mockRpc = {
  invoke: mockInvoke,
} as any

test('handleContextMenuKeyboard', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state = {
    ...createDefaultState(),
    focusedIndex: 2,
    x: 100,
    y: 200,
    minLineY: 0,
    itemHeight: 20,
  }
  const result = await HandleContextMenuKeyboard.handleContextMenuKeyboard(state)
  expect(mockInvoke).toHaveBeenCalledWith('ContextMenu.show', 100, 260, 4)
  expect(result).toBe(state)
})
