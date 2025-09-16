import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handlePasteCopy } from '../src/parts/HandlePasteCopy/HandlePasteCopy.ts'

test('should focus on first newly created file after paste copy', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'index.js', type: DirentType.File },
        { name: 'index copy.js', type: DirentType.File },
      ]
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['', '']
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [{ name: 'index.js', type: DirentType.File, path: '/test/index.js', depth: 0, selected: false }],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: ['/source/index.js'],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(2)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/index copy.js')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.copy', '/source/index.js', '/test/index copy.js'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test('should handle paste copy with multiple files and focus on first', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.copy'() {
      return undefined
    },
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1.txt', type: DirentType.File },
        { name: 'file1 copy.txt', type: DirentType.File },
        { name: 'file2.txt', type: DirentType.File },
        { name: 'file2 copy.txt', type: DirentType.File },
      ]
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return ['', '', '', '']
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/test/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: DirentType.File, path: '/test/file2.txt', depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: ['/source/file1.txt', '/source/file2.txt'],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(4)
  const focusedItem = result.items[result.focusedIndex]
  expect(focusedItem.path).toBe('/test/file1 copy.txt')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.copy', '/source/file1.txt', '/test/file1 copy.txt'],
    ['FileSystem.copy', '/source/file2.txt', '/test/file2 copy.txt'],
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})

test('should handle paste copy with empty files array', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'FileSystem.getPathSeparator'() {
      return '/'
    },
    'Preferences.get'() {
      return false
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const initialState: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    items: [],
    focusedIndex: 0,
  }

  const nativeFiles = {
    type: 'copy' as const,
    files: [],
    source: 'gnomeCopiedFiles' as const,
  }

  const result = await handlePasteCopy(initialState, nativeFiles)

  expect(result).toBeDefined()
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/test'],
  ])
})
