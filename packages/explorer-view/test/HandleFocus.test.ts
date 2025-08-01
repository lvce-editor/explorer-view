import { test, expect, jest } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

const invoke = jest.fn(async (method: string) => {
  if (method === 'Focus.setFocus') {
    return
  }
  throw new Error(`Unexpected method: ${method}`)
})

const mockRpc = MockRpc.create({
  invoke,
  commandMap: {},
})

test('handleFocus', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state = createDefaultState()
  const newState = await handleFocus(state)
  // @ts-ignore
  expect(invoke).toHaveBeenCalledWith('Focus.setFocus', WhenExpression.FocusExplorer)
  expect(newState).toBe(state)
})
