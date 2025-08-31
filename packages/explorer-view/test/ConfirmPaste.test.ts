import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { confirmPaste } from '../src/parts/ConfirmPaste/ConfirmPaste.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('confirmPaste returns true when user confirms', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'confirmPrompt.prompt') {
        return true
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await confirmPaste()
  expect(result).toBe(true)
})

test('confirmPaste returns false when user cancels', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'confirmPrompt.prompt') {
        return false
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await confirmPaste()
  expect(result).toBe(false)
})
