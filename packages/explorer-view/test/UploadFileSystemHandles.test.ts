import { expect, test } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.ts'
import { getFileOperations } from '../src/parts/GetFileOperations/GetFileOperations.ts'

test('uploadFileSystemHandles - creates correct file operations', async () => {
  const root = 'test-root'
  // Create mock file system handles
  const fileHandles = [
    {
      kind: 'file',
      name: 'test.txt',
      getFile: async () => ({
        text: async () => 'test content',
      }),
    },
    {
      kind: 'directory',
      name: 'test-dir',
      values: () => ({
        [Symbol.asyncIterator]: async function* () {
          yield {
            kind: 'file',
            name: 'nested.txt',
            getFile: async () => ({
              text: async () => 'nested content',
            }),
          }
        },
      }),
    },
  ] as unknown as FileSystemHandle[]

  const uploadTree = await createUploadTree(root, fileHandles)
  const fileOperations = getFileOperations(root, uploadTree)

  expect(fileOperations).toEqual([
    {
      type: 'createFile',
      path: 'test-root/test.txt',
      text: 'test content',
    },
    {
      type: 'createFolder',
      path: 'test-root/test-dir',
      text: '',
    },
    {
      type: 'createFile',
      path: 'test-root/test-dir/nested.txt',
      text: 'nested content',
    },
  ])
})

test('uploadFileSystemHandles - handles empty file handles', async () => {
  const root = 'test-root'
  const fileHandles = [] as FileSystemHandle[]

  const uploadTree = await createUploadTree(root, fileHandles)
  const fileOperations = getFileOperations(root, uploadTree)

  expect(fileOperations).toEqual([])
})
