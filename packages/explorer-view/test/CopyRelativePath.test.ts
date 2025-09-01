import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

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

  const mockInvoke = jest.fn(async (method: string, ...args: any[]): Promise<void> => {
    if (method === 'ClipBoard.writeText') {
      return
    }
    throw new Error(`unexpected method ${method}`)
  })
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: mockInvoke,
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  await copyRelativePath(mockState)
  expect(mockInvoke).toHaveBeenCalledWith('ClipBoard.writeText', 'test/file.txt')
})

test('copyRelativePath - returns state when no focused dirent', async (): Promise<void> => {
  const state = createDefaultState()
  const mockInvoke = jest.fn(async (method: string): Promise<void> => {
    if (method === 'ClipBoard.writeText') {
      return
    }
    throw new Error(`unexpected method ${method}`)
  })
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: mockInvoke,
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(mockInvoke).not.toHaveBeenCalled()
})
