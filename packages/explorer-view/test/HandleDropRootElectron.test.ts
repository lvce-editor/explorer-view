import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDrop } from '../src/parts/HandleDropRootElectron/HandleDropRootElectron.ts'

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

test('handleDrop - successful drop on root', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = createDefaultState()
  const fileHandles = [{ name: 'file1.txt' }, { name: 'file2.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('file1.txt', '/source/file1.txt'), new MockFile('file2.txt', '/source/file2.txt')]
  const paths = ['/source/file1.txt', '/source/file2.txt']

  const result = await handleDrop(state, fileHandles, files, paths)
  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/'],
    ['FileSystem.copy', '/source/file1.txt', '//file1.txt'],
    ['FileSystem.copy', '/source/file2.txt', '//file2.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDrop - with items in state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'existing.txt', path: '/existing.txt', selected: false, type: 1 }],
  }
  const fileHandles = [{ name: 'newfile.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('newfile.txt', '/source/newfile.txt')]
  const paths = ['/source/newfile.txt']

  const result = await handleDrop(state, fileHandles, files, paths)
  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/'],
    ['FileSystem.copy', '/source/newfile.txt', '//newfile.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDrop - error during copy', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      throw new Error('Permission denied')
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
  })

  const state = createDefaultState()
  const fileHandles = [{ name: 'file1.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('file1.txt', '/source/file1.txt')]
  const paths = ['/source/file1.txt']

  await expect(handleDrop(state, fileHandles, files, paths)).rejects.toThrow(new Error('Failed to drop files: Permission denied'))
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/'],
    ['FileSystem.copy', '/source/file1.txt', '/file1.txt'],
  ])
})

test('handleDrop - error during readDirWithFileTypes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      throw new Error('Directory not found')
    },
  })

  const state = createDefaultState()
  const fileHandles = [{ name: 'file1.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('file1.txt', '/source/file1.txt')]
  const paths = ['/source/file1.txt']

  await expect(handleDrop(state, fileHandles, files, paths)).rejects.toThrow(new Error('Failed to drop files: Directory not found'))
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/'],
    ['FileSystem.copy', '/source/file1.txt', '/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDrop - empty file handles', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = createDefaultState()
  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = []
  const paths: readonly string[] = []

  const result = await handleDrop(state, fileHandles, files, paths)
  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDrop - custom root path', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = {
    ...createDefaultState(),
    root: '/custom/root',
  }
  const fileHandles = [{ name: 'file1.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('file1.txt', '/source/file1.txt')]
  const paths = ['/source/file1.txt']

  const result = await handleDrop(state, fileHandles, files, paths)
  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', '/custom/root'],
    ['FileSystem.copy', '/source/file1.txt', '/custom/root/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/custom/root'],
  ])
})

test('handleDrop - Windows path separator', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '\\'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = {
    ...createDefaultState(),
    pathSeparator: '\\',
    root: 'C:\\Users\\test',
  }
  const fileHandles = [{ name: 'file1.txt' }] as FileSystemHandle[]
  const files: readonly File[] = [new MockFile('file1.txt', 'C:\\source\\file1.txt')]
  const paths = ['C:\\source\\file1.txt']

  const result = await handleDrop(state, fileHandles, files, paths)
  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getPathSeparator', 'C:\\Users\\test'],
    ['FileSystem.copy', 'C:\\source\\file1.txt', 'C:\\Users\\test\\file1.txt'],
    ['FileSystem.readDirWithFileTypes', 'C:\\Users\\test'],
  ])
})
