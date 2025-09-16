import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as GetEditingIcon from '../src/parts/GetEditingIcon/GetEditingIcon.ts'

test('getEditingIcon - CreateFile', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFile, 'test.txt')
  expect(result).toBe('file-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFileIcon', { name: 'test.txt' }]])
})

test('getEditingIcon - CreateFolder', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFolder, 'test-folder')
  expect(result).toBe('folder-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'test-folder' }]])
})

test('getEditingIcon - Rename File', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.File)
  expect(result).toBe('file-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFileIcon', { name: 'test.txt' }]])
})

test('getEditingIcon - Rename EditingFile', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.EditingFile)
  expect(result).toBe('file-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFileIcon', { name: 'test.txt' }]])
})

test('getEditingIcon - Rename Directory', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.Directory)
  expect(result).toBe('folder-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'test-folder' }]])
})

test('getEditingIcon - Rename EditingFolder', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingFolder)
  expect(result).toBe('folder-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'test-folder' }]])
})

test('getEditingIcon - Rename EditingDirectoryExpanded', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingDirectoryExpanded)
  expect(result).toBe('folder-icon')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'test-folder' }]])
})

test('getEditingIcon - Rename with unsupported dirent type', async () => {
  const mockRpc = RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test', DirentType.Symlink)
  expect(result).toBe('')
  expect(mockRpc.invocations).toEqual([])
})

test('getEditingIcon - Rename without dirent type', async () => {
  const mockRpc = RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test')
  expect(result).toBe('')
  expect(mockRpc.invocations).toEqual([])
})

test('getEditingIcon - None editing type', async () => {
  const mockRpc = RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.None, 'test')
  expect(result).toBe('')
  expect(mockRpc.invocations).toEqual([])
})

test('getEditingIcon - unknown editing type', async () => {
  const mockRpc = RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(999, 'test')
  expect(result).toBe('')
  expect(mockRpc.invocations).toEqual([])
})
