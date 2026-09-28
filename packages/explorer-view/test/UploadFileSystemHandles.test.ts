import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { uploadFileSystemHandles } from '../src/parts/UploadFileSystemHandles/UploadFileSystemHandles.ts'

class MockFileHandle implements FileSystemHandle {
  kind: 'file' | 'directory'
  name: string
  getFile?: () => Promise<Blob>
  values?: () => { [Symbol.asyncIterator]: () => AsyncGenerator<MockFileHandle> }

  constructor(kind: 'file' | 'directory', name: string, content?: string | Uint8Array, children?: MockFileHandle[]) {
    this.kind = kind
    this.name = name

    if (kind === 'file' && content) {
      this.getFile = async (): Promise<Blob> => {
        if (typeof content === 'string') {
          return new Blob([content])
        }
        const buffer = new ArrayBuffer(content.byteLength)
        new Uint8Array(buffer).set(content)
        return new Blob([buffer])
      }
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
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return true
    },
    'FileSystem.writeBlob'() {
      return true
    },
  })
  const fileHandle = new MockFileHandle('file', 'test.txt', 'content')
  const result = await uploadFileSystemHandles('/', '/', [fileHandle])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0][0]).toBe('FileSystem.writeBlob')
  expect(mockRpc.invocations[0][1]).toBe('/test.txt')
  await expect((mockRpc.invocations[0][2] as Blob).text()).resolves.toBe('content')
})

test('upload preserves binary bytes and filenames with spaces and parentheses', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeBlob'() {
      return true
    },
  })
  const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff])
  const fileHandle = new MockFileHandle('file', 'image (2).png', bytes)

  await uploadFileSystemHandles('html:///workspace', '/', [fileHandle])

  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0][0]).toBe('FileSystem.writeBlob')
  expect(mockRpc.invocations[0][1]).toBe('html:///workspace/image (2).png')
  const writtenBlob = mockRpc.invocations[0][2] as Blob
  const writtenBytes = new Uint8Array(await writtenBlob.arrayBuffer())
  expect([...writtenBytes]).toEqual([...bytes])
})

test('upload directory with files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return true
    },
    'FileSystem.writeBlob'() {
      return true
    },
  })
  const file1 = new MockFileHandle('file', 'file1.txt', 'content1')
  const file2 = new MockFileHandle('file', 'file2.txt', 'content2')
  const dir = new MockFileHandle('directory', 'dir', undefined, [file1, file2])
  const result = await uploadFileSystemHandles('/', '/', [dir])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/dir'],
    ['FileSystem.writeBlob', '/dir/file1.txt', expect.any(Blob)],
    ['FileSystem.writeBlob', '/dir/file2.txt', expect.any(Blob)],
  ])
})

test('upload multiple files and directories', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return true
    },
    'FileSystem.writeBlob'() {
      return true
    },
  })
  const file1 = new MockFileHandle('file', 'file1.txt', 'content1')
  const file2 = new MockFileHandle('file', 'file2.txt', 'content2')
  const dir1 = new MockFileHandle('directory', 'dir1', undefined, [file1])
  const dir2 = new MockFileHandle('directory', 'dir2', undefined, [file2])
  const result = await uploadFileSystemHandles('/', '/', [dir1, dir2])
  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/dir1'],
    ['FileSystem.writeBlob', '/dir1/file1.txt', expect.any(Blob)],
    ['FileSystem.mkdir', '/dir2'],
    ['FileSystem.writeBlob', '/dir2/file2.txt', expect.any(Blob)],
  ])
})
