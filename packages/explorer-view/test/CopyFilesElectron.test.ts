import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { copyFilesElectron } from '../src/parts/CopyFilesElectron/CopyFilesElectron.ts'

test('copyFilesElectron', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
  })

  const root = '/test'
  const fileHandles: readonly FileSystemHandle[] = [
    { kind: 'file', name: 'file1.txt' } as FileSystemFileHandle,
    { kind: 'file', name: 'file2.txt' } as FileSystemFileHandle,
  ]
  const paths = ['/source/file1.txt', '/source/file2.txt']

  await copyFilesElectron(root, fileHandles, paths)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.copy', '/source/file1.txt', '/test/file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/test/file2.txt'],
  ])
})
