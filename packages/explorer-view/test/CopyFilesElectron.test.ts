import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { copyFilesElectron } from '../src/parts/CopyFilesElectron/CopyFilesElectron.ts'

test('copyFilesElectron', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
  })

  const root = '/test'
  const fileHandles = [{ name: 'file1.txt' }, { name: 'file2.txt' }] as FileSystemHandle[]
  const files: readonly File[] = []
  const paths = ['/source/file1.txt', '/source/file2.txt']

  await copyFilesElectron(root, fileHandles, files, paths)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/test'],
    ['FileSystem.copy', '/source/file1.txt', '/test/file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/test/file2.txt'],
  ])
})
