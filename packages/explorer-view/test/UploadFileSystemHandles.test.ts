import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { uploadFileSystemHandles } from '../src/parts/UploadFileSystemHandles/UploadFileSystemHandles.ts'

class MockFileHandle implements FileSystemHandle {
  kind: 'file' | 'directory'
  name: string
  getFile?: () => Promise<{ text: () => Promise<string> }>
  values?: () => { [Symbol.asyncIterator]: () => AsyncGenerator<MockFileHandle> }

  constructor(kind: 'file' | 'directory', name: string, content?: string, children?: MockFileHandle[]) {
    this.kind = kind
    this.name = name

    if (kind === 'file' && content) {
      this.getFile = async (): Promise<{ text: () => Promise<string> }> => ({
        text: async (): Promise<string> => content,
      })
    }

    if (kind === 'directory' && children) {
      this.values = (): { [Symbol.asyncIterator]: () => AsyncGenerator<MockFileHandle> } => ({
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<MockFileHandle> {
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

test('upload single file', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return true
    },
    'FileSystem.mkdir'() {
      return true
    },
  })
  const fileHandle = new MockFileHandle('file', 'test.txt', 'content')
  const result = await uploadFileSystemHandles('/', '/', [fileHandle])
  expect(result).toBe(true)
})

test('upload directory with files', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return true
    },
    'FileSystem.mkdir'() {
      return true
    },
  })
  const file1 = new MockFileHandle('file', 'file1.txt', 'content1')
  const file2 = new MockFileHandle('file', 'file2.txt', 'content2')
  const dir = new MockFileHandle('directory', 'dir', undefined, [file1, file2])
  const result = await uploadFileSystemHandles('/', '/', [dir])
  expect(result).toBe(true)
})

test('upload multiple files and directories', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.writeFile'() {
      return true
    },
    'FileSystem.mkdir'() {
      return true
    },
  })
  const file1 = new MockFileHandle('file', 'file1.txt', 'content1')
  const file2 = new MockFileHandle('file', 'file2.txt', 'content2')
  const dir1 = new MockFileHandle('directory', 'dir1', undefined, [file1])
  const dir2 = new MockFileHandle('directory', 'dir2', undefined, [file2])
  const result = await uploadFileSystemHandles('/', '/', [dir1, dir2])
  expect(result).toBe(true)
})
