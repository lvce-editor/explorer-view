import { test, expect } from '@jest/globals'
import { jest } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { removeDirent } from '../src/parts/RemoveDirent/RemoveDirent.ts'

test('removeDirent - removes focused item', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('removeDirent - removes multiple selected items', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.remove', '/file2.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('removeDirent - removes focused item and selected items', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
      { name: 'file3.txt', type: File, path: '/file3.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.remove', '/file2.txt'],
    ['FileSystem.remove', '/file3.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('remove file', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
    'FileSystem.readDirWithFileTypes'() {
      return [{ name: 'folder1', type: DirentType.Directory }]
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
      { name: 'folder1', type: Directory, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false },
    ],
    focusedIndex: 1,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.remove', '/file1.txt'],
    ['FileSystem.readDirWithFileTypes', '/'],
  ])
})

test('remove folder with children', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/',
    items: [
      { name: 'folder1', type: DirectoryExpanded, path: '/folder1', depth: 0, selected: false },
      { name: 'file1.txt', type: File, path: '/folder1/file1.txt', depth: 1, selected: false },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test('remove file from expanded folder', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
    'FileSystem.readDirWithFileTypes'(path: string) {
      if (path === '/') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      if (path === '/folder1') {
        return []
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
    ],
    focusedIndex: 1,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].name).toBe('folder1')
  expect(result.items[0].type).toBe(DirectoryExpanded)
  expect(result.focusedIndex).toBe(0)
})

test.skip('removeDirent - with confirmation enabled and user confirms', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(_message?: string) {
      return true
    },
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})

test.skip('removeDirent - with confirmation enabled and user cancels', async () => {
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(_message?: string) {
      return false
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(2)
  expect(result.focusedIndex).toBe(0)
})

test('removeDirent - shows error message when file operation fails', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const confirmFn = jest.fn()
  confirmFn.mockImplementation(() => true)
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(message?: string) {
      return confirmFn(message)
    },
    'FileSystem.remove'() {
      throw new Error('Permission denied')
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result).toBe(state)
  expect(confirmFn).toHaveBeenCalledWith('Error: Permission denied')
  expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
    message: expect.stringContaining('Failed to apply file operations: Permission denied')
  }))
})

test('removeDirent - shows error message for multiple files when operation fails', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const confirmFn = jest.fn()
  confirmFn.mockImplementation(() => true)
  RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt'(message?: string) {
      return confirmFn(message)
    },
    'FileSystem.remove'() {
      throw new Error('Access denied')
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result).toBe(state)
  expect(confirmFn).toHaveBeenCalledWith('Error: Access denied')
  expect(consoleErrorSpy).toHaveBeenCalledWith(expect.objectContaining({
    message: expect.stringContaining('Failed to apply file operations: Access denied')
  }))
})

test('removeDirent - continues normally when no error occurs', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.remove'() {
      return
    },
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

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: File, path: '/file1.txt', depth: 0, selected: false }],
    focusedIndex: 0,
    confirmDelete: false,
  }

  const result = await removeDirent(state)
  expect(result.items).toHaveLength(0)
  expect(result.focusedIndex).toBe(-1)
})
