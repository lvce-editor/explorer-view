import { expect, test } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.ts'
import { getFileOperations } from '../src/parts/GetFileOperations/GetFileOperations.ts'

class MockFileHandle implements FileSystemHandle {
  kind: 'file' | 'directory'
  name: string
  getFile?: () => Promise<{ text: () => Promise<string> }>
  values?: () => { [Symbol.asyncIterator]: () => AsyncGenerator<MockFileHandle> }

  constructor(kind: 'file' | 'directory', name: string, content?: string, children?: MockFileHandle[]) {
    this.kind = kind
    this.name = name

    if (kind === 'file' && content) {
      this.getFile = async () => ({
        text: async () => content,
      })
    }

    if (kind === 'directory' && children) {
      this.values = () => ({
        [Symbol.asyncIterator]: async function* () {
          for (const child of children) {
            yield child
          }
        },
      })
    }
  }

  async isSameEntry(other: FileSystemHandle): Promise<boolean> {
    return this === other
  }
}

test('uploadFileSystemHandles - creates correct file operations', async () => {
  const root = 'test-root'
  const fileHandles = [
    new MockFileHandle('file', 'test.txt', 'test content'),
    new MockFileHandle('directory', 'test-dir', undefined, [new MockFileHandle('file', 'nested.txt', 'nested content')]),
  ]

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
  const fileHandles: readonly FileSystemHandle[] = []
  const uploadTree = await createUploadTree(root, fileHandles)
  const fileOperations = getFileOperations(root, uploadTree)
  expect(fileOperations).toEqual([])
})
