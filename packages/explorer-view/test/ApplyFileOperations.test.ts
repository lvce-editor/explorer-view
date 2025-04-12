import type { Rpc } from '@lvce-editor/rpc'
import { test, expect, jest } from '@jest/globals'
import type { FileOperation } from '../src/parts/GetFileOperations/GetFileOperations.ts'
import { applyFileOperations } from '../src/parts/ApplyFileOperations/ApplyFileOperations.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc: Rpc = {
  send: jest.fn(),
  invoke: jest.fn((method: string, ...args: any[]) => {
    if (method === 'FileSystem.mkdir') {
      return Promise.resolve()
    }
    if (method === 'FileSystem.writeFile') {
      return Promise.resolve()
    }
    throw new Error(`Unexpected method: ${method}`)
  }),
  // @ts-ignore
  invokeAndTransfer: jest.fn(),
  // @ts-ignore
  dispose: jest.fn(),
}

test('should apply empty operations', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const operations: readonly FileOperation[] = []
  await applyFileOperations(operations)
  expect(mockRpc.invoke).not.toHaveBeenCalled()
})

test('should create folder', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const operations: readonly FileOperation[] = [{ type: 'createFolder', path: '/test/folder', text: '' }]
  await applyFileOperations(operations)
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.mkdir', '/test/folder')
})

test('should create file', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const operations: readonly FileOperation[] = [{ type: 'createFile', path: '/test/file.txt', text: 'content' }]
  await applyFileOperations(operations)
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.writeFile', '/test/file.txt', 'content')
})

test('should apply multiple operations in sequence', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const operations: readonly FileOperation[] = [
    { type: 'createFolder', path: '/test/folder', text: '' },
    { type: 'createFile', path: '/test/folder/file.txt', text: 'content' },
  ]
  await applyFileOperations(operations)
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.mkdir', '/test/folder')
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.writeFile', '/test/folder/file.txt', 'content')
})
