import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handlePasteCopy } from '../src/parts/HandlePasteCopy/HandlePasteCopy.ts'

test('should focus on first newly created file after paste copy', async () => {
  let readCount = 0
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      readCount++
      return readCount === 1
        ? [{ name: 'index.js', type: DirentType.File }]
        : [
            { name: 'index.js', type: DirentType.File },
            { name: 'index copy.js', type: DirentType.File },
          ]
    },
    'IconTheme.getIcons'() {
      return ['', '']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'index.js', path: '/test/index.js', selected: false, type: DirentType.File }],
    root: '/test',
  }

  const nativeFiles = {
    files: ['/source/index.js'],
    source: 'gnomeCopiedFiles' as const,
    type: 'copy' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(2)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/index copy.js')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
    ['FileSystem.copy', '/source/index.js', '/test/index copy.js'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test('should handle paste copy with multiple files and focus on first', async () => {
  let readCount = 0
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      readCount++
      return readCount === 1
        ? [
            { name: 'file1.txt', type: DirentType.File },
            { name: 'file2.txt', type: DirentType.File },
          ]
        : [
            { name: 'file1.txt', type: DirentType.File },
            { name: 'file1 copy.txt', type: DirentType.File },
            { name: 'file2.txt', type: DirentType.File },
            { name: 'file2 copy.txt', type: DirentType.File },
          ]
    },
    'IconTheme.getIcons'() {
      return ['', '', '', '']
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'file1.txt', path: '/test/file1.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'file2.txt', path: '/test/file2.txt', selected: false, type: DirentType.File },
    ],
    root: '/test',
  }

  const nativeFiles = {
    files: ['/source/file1.txt', '/source/file2.txt'],
    source: 'gnomeCopiedFiles' as const,
    type: 'copy' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(4)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/file1 copy.txt')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
    ['FileSystem.copy', '/source/file1.txt', '/test/file1 copy.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/test/file2 copy.txt'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test('should handle paste copy with empty files array', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return []
    },
    'Preferences.get'() {
      return false
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [],
    root: '/test',
  }

  const nativeFiles = {
    files: [],
    source: 'gnomeCopiedFiles' as const,
    type: 'copy' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test('should preserve existing file when pasting into collapsed folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {},
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/test/target') {
        return [{ name: 'file.txt', type: DirentType.File }]
      }
      return [
        { name: 'file.txt', type: DirentType.File },
        { name: 'target', type: DirentType.Directory },
      ]
    },
    'IconTheme.getIcons'() {
      return ['', '']
    },
    'Preferences.get'() {
      return false
    },
  })
  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'target', path: '/test/target', selected: false, type: DirentType.Directory },
    ],
    root: '/test',
  }
  const nativeFiles = {
    files: ['/test/file.txt'],
    source: 'gnomeCopiedFiles' as const,
    type: 'copy' as const,
  }

  await handlePasteCopy(initialState, nativeFiles)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test/target'],
    ['FileSystem.copy', '/test/file.txt', '/test/target/file copy.txt'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})
