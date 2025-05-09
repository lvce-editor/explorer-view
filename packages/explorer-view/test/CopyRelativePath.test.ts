import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as rpcregistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('copyRelativePath - copies relative path of focused dirent', async (): Promise<void> => {
  const state = createDefaultState()
  const mockState = {
    ...state,
    focusedDirent: {
      path: '/test/file.txt',
      name: 'file.txt',
      type: 'file',
    },
  }

  let clipboardText = ''
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string, ...args: any[]): Promise<void> => {
      if (method === 'ClipBoard.writeText') {
        clipboardText = args[0]
      }
    },
  })
  rpcregistry.set(RpcId.RendererWorker, mockRpc)
  await copyRelativePath(mockState)
  expect(clipboardText).toBe('')
})

test('copyRelativePath - returns state when no focused dirent', async (): Promise<void> => {
  const state = createDefaultState()
  let clipboardCalled = false
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string): Promise<void> => {
      if (method === 'ClipBoard.writeText') {
        clipboardCalled = true
      }
    },
  })
  rpcregistry.set(RpcId.RendererWorker, mockRpc)
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(clipboardCalled).toBe(false)
})
