import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleDropIndex } from '../src/parts/HandleDropIndex/HandleDropIndex.ts'

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

test('handleDropIndex - drop into empty directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(state, fileHandles, files, paths, -1)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDropIndex - drop into directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into expanded directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'file',
      name: 'file.txt',
      path: '/file.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDropIndex - drop into file with parent folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file.txt',
      path: '/folder/file.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 1)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into file at root level', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'file',
      name: 'file.txt',
      path: '/file.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('handleDropIndex - drop into directory with children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'existing.txt',
      path: '/folder/existing.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into directory with multiple children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file1.txt',
      path: '/folder/file1.txt',
      selected: false,
      type: DirentType.File,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file2.txt',
      path: '/folder/file2.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into nested directory', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'folder',
      name: 'subfolder',
      path: '/folder/subfolder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 1)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder/subfolder'],
  ])
})

test('handleDropIndex - drop with file handles', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const mockFileHandle = {
    getFile: async () => new MockFile('test.txt', '/test.txt'),
    kind: 'file',
    name: 'test.txt',
  } as unknown as FileSystemHandle

  const fileHandles: readonly FileSystemHandle[] = [mockFileHandle]
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [mockFileHandle]],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop with empty file handles and files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = []
  const paths: readonly string[] = []

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', []],
    ['FileSystem.readDirWithFileTypes', '/folder'],
  ])
})

test('handleDropIndex - drop into directory updates parent setSize', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'existing.txt',
      path: '/folder/existing.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.items[0].setSize).toBe(2)
})

test('handleDropIndex - drop into directory with multiple children updates parent setSize', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file1.txt',
      path: '/folder/file1.txt',
      selected: false,
      type: DirentType.File,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file2.txt',
      path: '/folder/file2.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.items[0].setSize).toBe(3)
})

test('handleDropIndex - drop into directory updates dropTargets', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, dropTargets: [0], items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.dropTargets).toEqual([])
})

test('handleDropIndex - drop into directory changes type to DirectoryExpanded', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items[0].type).toBe(DirentType.DirectoryExpanded)
})

test('handleDropIndex - drop into expanded directory keeps type as DirectoryExpanded', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items[0].type).toBe(DirentType.DirectoryExpanded)
})

test('handleDropIndex - drop into directory with children adds new child', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'existing.txt',
      path: '/folder/existing.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.items.length).toBeGreaterThan(2)
})

test('handleDropIndex - drop into directory with multiple children adds new child in correct position', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file1.txt',
      path: '/folder/file1.txt',
      selected: false,
      type: DirentType.File,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file2.txt',
      path: '/folder/file2.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.items.length).toBeGreaterThan(3)
  // Verify the order: folder, file1, file2, new file
  expect(result.items[0].name).toBe('folder')
  expect(result.items[1].name).toBe('file1.txt')
  expect(result.items[2].name).toBe('file2.txt')
})

test('handleDropIndex - drop into nested directory with siblings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'folder',
      name: 'subfolder',
      path: '/folder/subfolder',
      selected: false,
      type: DirentType.Directory,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'file.txt',
      path: '/folder/file.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 1)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.items.length).toBeGreaterThan(3)
  // Verify the order: folder, subfolder, new file, file.txt
  expect(result.items[0].name).toBe('folder')
  expect(result.items[1].name).toBe('subfolder')
  expect(result.items[2].name).toBe('test.txt')
  expect(result.items[3].name).toBe('file.txt')
})

test('handleDropIndex - drop into directory updates parent depth correctly', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'file',
      name: 'existing.txt',
      path: '/folder/existing.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 0)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  // The new child should have depth 1 (parent depth + 1)
  const newChild = result.items.find((item) => item.name === 'test.txt')
  expect(newChild).toBeDefined()
  expect(newChild?.depth).toBe(1)
})

test('handleDropIndex - drop into nested directory updates parent depth correctly', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystemHandle.getFileHandles'() {
      return []
    },
    'IconTheme.getIcons'() {
      return ['']
    },
  })

  const state = createDefaultState()
  const items: ExplorerItem[] = [
    {
      depth: 0,
      icon: 'folder',
      name: 'folder',
      path: '/folder',
      selected: false,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 1,
      icon: 'folder',
      name: 'subfolder',
      path: '/folder/subfolder',
      selected: false,
      type: DirentType.Directory,
    },
  ]
  const stateWithItems = { ...state, items }

  const fileHandles: readonly FileSystemHandle[] = []
  const files: readonly File[] = [new MockFile('test.txt', '/test.txt')]
  const paths: readonly string[] = ['/test.txt']

  const result = await handleDropIndex(stateWithItems, fileHandles, files, paths, 1)

  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  // The new child should have depth 2 (parent depth + 1)
  const newChild = result.items.find((item) => item.name === 'test.txt')
  expect(newChild).toBeDefined()
  expect(newChild?.depth).toBe(2)
})
