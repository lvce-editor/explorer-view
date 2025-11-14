import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { updateEditingValue } from '../src/parts/UpdateEditingValue/UpdateEditingValue.ts'

test('updateEditingValue - updates state with new value', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })
  const state: ExplorerState = createDefaultState()
  const newValue = 'new value'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
  expect(mockRpc.invocations).toEqual([])
})

test('updateEditingValue - updates state with new value and input source', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })
  const state: ExplorerState = createDefaultState()
  const newValue = 'new value'
  const result = await updateEditingValue(state, newValue, InputSource.User)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
  expect(mockRpc.invocations).toEqual([])
})

test('updateEditingValue - updates file icon', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
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
  }
  const newValue = 'test.txt'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('file-test.txt')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFileIcon', { name: 'test.txt' }]])
})

test('updateEditingValue - updates folder icon', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
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
  }
  const newValue = 'test'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('folder-test')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'test' }]])
})

test('updateEditingValue - updates file icon when renaming file', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
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
    editingIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const newValue = 'new.txt'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('file-new.txt')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFileIcon', { name: 'new.txt' }]])
})

test('updateEditingValue - updates folder icon when renaming folder', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
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
    editingIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false }],
  }
  const newValue = 'new'
  const result = await updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('folder-new')
  expect(mockRpc.invocations).toEqual([['IconTheme.getFolderIcon', { name: 'new' }]])
})

test('updateEditingValue - preserves other state properties', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'(params: any) {
      return `file-${params.name}`
    },
    'IconTheme.getFolderIcon'(params: any) {
      return `folder-${params.name}`
    },
  })
  const state: ExplorerState = createDefaultState()
  const result = await updateEditingValue(state, 'new value')
  expect(result.uid).toBe(state.uid)
  expect(result.root).toBe(state.root)
  expect(result.items).toBe(state.items)
  expect(mockRpc.invocations).toEqual([])
})

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
