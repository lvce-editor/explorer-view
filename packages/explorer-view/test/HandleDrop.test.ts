import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

class MockFile implements File {
  constructor(
    public name: string,
    public path: string,
    public size: number = 0,
    public type: string = 'text/plain',
    public lastModified: number = 0,
    public webkitRelativePath: string = '',
  ) {}

  async arrayBuffer(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0)
  }

  slice(): Blob {
    return new Blob()
  }

  stream(): ReadableStream<Uint8Array<ArrayBuffer>> {
    return new ReadableStream()
  }

  async text(): Promise<string> {
    return ''
  }

  async bytes(): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array(0)
  }
}

class MockFileList implements FileList {
  private files: readonly File[]

  constructor(files: readonly File[]) {
    this.files = files
  }

  get length(): number {
    return this.files.length
  }

  item(index: number): File | null {
    return this.files[index] || null
  }

  [index: number]: File

  [Symbol.iterator](): Iterator<File> {
    return this.files[Symbol.iterator]()
  }
}

test('handleDrop - successful drop', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'FileSystemHandle.getFileHandles') {
        return []
      }
      if (method === 'IconTheme.getIcons') {
        return ['']
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const fileList = new MockFileList([new MockFile('test.txt', '/test.txt')])

  const result = await handleDrop(state, 0, 0, [1], fileList)
  expect(result).toBeDefined()
})

test('handleDrop - error case', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: () => {
      throw new Error('test error')
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const fileList = new MockFileList([new MockFile('test.txt', '/test.txt')])

  await expect(handleDrop(state, 0, 0, [1], fileList)).rejects.toThrow(new Error('Failed to drop files: test error'))
})
