import { expect, test } from '@jest/globals'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as rpcregistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('copyRelativePath - copies relative path of focused dirent', async () => {
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
  const mockRpc = {
    invoke: async (method: string, ...args: any[]) => {
      if (method === 'ClipBoard.writeText') {
        clipboardText = args[0]
      }
    },
    send: () => {},
    invokeAndTransfer: async () => {},
    dispose: async () => {},
  }
  rpcregistry.set(RpcId.RendererWorker, mockRpc)
  await copyRelativePath(mockState)
  expect(clipboardText).toBe('')
})

test('copyRelativePath - returns state when no focused dirent', async () => {
  const state = createDefaultState()
  let clipboardCalled = false
  const mockRpc = {
    invoke: async (method: string) => {
      if (method === 'ClipBoard.writeText') {
        clipboardCalled = true
      }
    },
    send: () => {},
    invokeAndTransfer: async () => {},
    dispose: async () => {},
  }
  rpcregistry.set(RpcId.RendererWorker, mockRpc)
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(clipboardCalled).toBe(false)
})
