import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { updateEditingValue } from '../src/parts/UpdateEditingValue/UpdateEditingValue.ts'

test('updateEditingValue - real-time validation during file creation', async () => {
  RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFile,
    focusedIndex: 0,
    items: [
      {
        path: '/root/existing-file.txt',
        name: 'existing-file.txt',
        depth: 0,
        type: DirentType.File,
        icon: '',
        selected: false,
        posInSet: 0,
        setSize: 1,
      },
    ],
  }

  // Test typing a name that already exists
  const result = await updateEditingValue(state, 'existing-file.txt')
  expect(result.editingErrorMessage).toBe('A file or folder **{0}** already exists at this location. Please choose a different name.')

  // Test typing a name that doesn't exist
  const result2 = await updateEditingValue(state, 'new-file.txt')
  expect(result2.editingErrorMessage).toBe('')
})

test('updateEditingValue - real-time validation during folder creation', async () => {
  RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.CreateFolder,
    focusedIndex: 0,
    items: [
      {
        path: '/root/existing-folder',
        name: 'existing-folder',
        depth: 0,
        type: DirentType.Directory,
        icon: '',
        selected: false,
        posInSet: 0,
        setSize: 1,
      },
    ],
  }

  // Test typing a name that already exists
  const result = await updateEditingValue(state, 'existing-folder')
  expect(result.editingErrorMessage).toBe('A file or folder **{0}** already exists at this location. Please choose a different name.')

  // Test typing a name that doesn't exist
  const result2 = await updateEditingValue(state, 'new-folder')
  expect(result2.editingErrorMessage).toBe('')
})

test('updateEditingValue - no validation during rename', async () => {
  RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.Rename,
    focusedIndex: 0,
    items: [
      {
        path: '/root/existing-file.txt',
        name: 'existing-file.txt',
        depth: 0,
        type: DirentType.File,
        icon: '',
        selected: false,
        posInSet: 0,
        setSize: 1,
      },
    ],
  }

  // During rename, file existence validation should not apply
  const result = await updateEditingValue(state, 'existing-file.txt')
  expect(result.editingErrorMessage).toBe('')
})
