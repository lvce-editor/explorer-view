import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { applyFileOperations } from '../src/parts/ApplyFileOperations/ApplyFileOperations.ts'
import type { FileOperation } from '../src/parts/FileOperation/FileOperation.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'

test('should apply empty operations', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = []
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([])
})

test('should create folder', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [{ type: FileOperationType.CreateFolder, path: '/test/folder' }]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([['FileSystem.mkdir', '/test/folder']])
})

test('should create file', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [{ type: FileOperationType.CreateFile, path: '/test/file.txt', text: 'content' }]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', '/test/file.txt', 'content']])
})

test('should apply multiple operations in sequence', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {},
    'FileSystem.writeFile'() {},
  })
  const operations: readonly FileOperation[] = [
    { type: FileOperationType.CreateFolder, path: '/test/folder' },
    { type: FileOperationType.CreateFile, path: '/test/folder/file.txt', text: 'content' },
  ]
  await applyFileOperations(operations)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/test/folder'],
    ['FileSystem.writeFile', '/test/folder/file.txt', 'content'],
  ])
})
