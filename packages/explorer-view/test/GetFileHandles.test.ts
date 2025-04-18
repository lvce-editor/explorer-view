import type { Rpc } from '@lvce-editor/rpc'
import { test, expect } from '@jest/globals'
import { getFileHandles } from '../src/parts/GetFileHandles/GetFileHandles.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

class MockFileHandle {
  constructor(public name: string) {}
}

test('getFileHandles', async () => {
  const fileIds = [1, 2, 3]
  const mockFiles = [new MockFileHandle('file1'), new MockFileHandle('file2'), new MockFileHandle('file3')]

  const mockRpc: Rpc = {
    invoke: async () => mockFiles,
    send: () => {},
    invokeAndTransfer: async () => mockFiles,
    dispose: async () => {},
  }

  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await getFileHandles(fileIds)
  expect(result).toBe(mockFiles)
  expect(result[0]).toBeInstanceOf(MockFileHandle)
})
