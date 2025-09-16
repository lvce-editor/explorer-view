import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { refresh } from '../src/parts/Refresh/Refresh.ts'

test('refresh - empty state', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = createDefaultState()
  const result = await refresh(state)
  expect(result.items).toHaveLength(0)
  expect(result.icons).toHaveLength(0)
})

test('refresh - with top level items', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', type: DirentType.File },
        { name: 'file2', type: DirentType.File },
      ]
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = createDefaultState()
  const result = await refresh(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('file1')
  expect(result.items[1].name).toBe('file2')
})

test('refresh - preserve expanded folder', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(_path: string) {
      if (_path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (_path === '/folder1') {
        return [
          { name: 'file1.txt', type: 'file' },
          { name: 'file2.txt', type: 'file' },
        ]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/file1.txt', depth: 1, selected: false },
      { name: 'file2.txt', type: File, path: '/folder1/file2.txt', depth: 1, selected: false },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('file1.txt')
  expect(result.items[2].name).toBe('file2.txt')
})

test('refresh - remove expanded folder that no longer exists', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'file1.txt', type: DirentType.File }]
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/file1.txt', depth: 1, selected: false },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('file1.txt')
})

test('refresh - nested expanded folders', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (path === '/folder1') {
        return [{ name: 'folder2', type: DirentType.Directory }]
      }
      if (path === '/folder1/folder2') {
        return [{ name: 'file1.txt', type: DirentType.File }]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'folder2', type: DirectoryExpanded, path: '/folder1/folder2', depth: 1, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/folder2/file1.txt', depth: 2, selected: false },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(3)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('folder2')
  expect(result.items[1].type).toBe(DirectoryExpanded)
  expect(result.items[2].name).toBe('file1.txt')
})

test('refresh - preserve directory types', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [
          { name: 'folder1', type: DirentType.Directory },
          { name: 'file1.txt', type: DirentType.File },
        ]
      }
      if (path === '/folder1') {
        return [
          { name: 'subfolder', type: DirentType.Directory },
          { name: 'file2.txt', type: DirentType.File },
        ]
      }
      if (path === '/folder1/subfolder') {
        return [{ name: 'file3.txt', type: DirentType.File }]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      return ''
    },
    'IconTheme.getFolderIcon'() {
      return ''
    },
    'IconTheme.getIcons'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'subfolder', type: DirectoryExpanded, path: '/folder1/subfolder', depth: 1, selected: false },
      { name: 'file3.txt', type: File, path: '/folder1/subfolder/file3.txt', depth: 2, selected: false },
      { name: 'file2.txt', type: File, path: '/folder1/file2.txt', depth: 1, selected: false },
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
    ],
  }

  const result = await refresh(state)
  expect(result.items).toHaveLength(5)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].name).toBe('subfolder')
  expect(result.items[1].type).toBe(DirectoryExpanded)
  expect(result.items[2].name).toBe('file3.txt')
  expect(result.items[2].type).toBe(File)
  expect(result.items[3].name).toBe('file2.txt')
  expect(result.items[3].type).toBe(File)
  expect(result.items[4].name).toBe('file1.txt')
  expect(result.items[4].type).toBe(File)
})

test('refresh - check filesystem response', async () => {
  const methodCalls: string[] = []
  RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(path: string) {
      methodCalls.push('FileSystem.readDirWithFileTypes')
      if (path === '/') {
        return [
          { name: 'folder1', type: DirentType.Directory },
          { name: 'file1.txt', type: DirentType.File },
        ]
      }
      return []
    },
    'IconTheme.getFileIcon'() {
      methodCalls.push('IconTheme.getFileIcon')
      return ''
    },
    'IconTheme.getFolderIcon'() {
      methodCalls.push('IconTheme.getFolderIcon')
      return ''
    },
    'IconTheme.getIcons'() {
      methodCalls.push('IconTheme.getIcons')
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
    ],
  }

  const result = await refresh(state)
  expect(methodCalls).toContain('FileSystem.readDirWithFileTypes')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.items[1].type).toBe(File)
})
