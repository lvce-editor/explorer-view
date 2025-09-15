import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as GetEditingIcon from '../src/parts/GetEditingIcon/GetEditingIcon.ts'

test('getEditingIcon - CreateFile', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFile, 'test.txt')
  expect(result).toBe('file-icon')
})

test('getEditingIcon - CreateFolder', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.CreateFolder, 'test-folder')
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename File', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.File)
  expect(result).toBe('file-icon')
})

test('getEditingIcon - Rename EditingFile', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'file-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test.txt', DirentType.EditingFile)
  expect(result).toBe('file-icon')
})

test('getEditingIcon - Rename Directory', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.Directory)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename EditingFolder', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingFolder)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename EditingDirectoryExpanded', async () => {
  IconThemeWorker.registerMockRpc({
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
  })

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test-folder', DirentType.EditingDirectoryExpanded)
  expect(result).toBe('folder-icon')
})

test('getEditingIcon - Rename with unsupported dirent type', async () => {
  RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test', DirentType.Symlink)
  expect(result).toBe('')
})

test('getEditingIcon - Rename without dirent type', async () => {
  RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.Rename, 'test')
  expect(result).toBe('')
})

test('getEditingIcon - None editing type', async () => {
  RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(ExplorerEditingType.None, 'test')
  expect(result).toBe('')
})

test('getEditingIcon - unknown editing type', async () => {
  RendererWorker.registerMockRpc({})

  const result = await GetEditingIcon.getEditingIcon(999, 'test')
  expect(result).toBe('')
})
