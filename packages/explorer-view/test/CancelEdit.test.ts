import { expect, test } from '@jest/globals'
import { RendererWorker, IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { cancelEdit } from '../src/parts/CancelEdit/CancelEdit.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('cancelEdit', async () => {
  RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'test.txt',
    editingType: ExplorerEditingType.CreateFile,
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    focusedIndex: 1,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})

test('cancelEdit - removes editing items', async () => {
  RendererWorker.registerMockRpc({})

  IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'test.txt',
    editingType: ExplorerEditingType.CreateFile,
    items: [
      {
        depth: 0,
        icon: '',
        name: 'file1.txt',
        path: '/file1.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
        selected: false,
      },
      {
        depth: 0,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 2,
        setSize: 1,
        type: DirentType.EditingFile,
        selected: false,
      },
      {
        depth: 0,
        icon: '',
        name: 'newfolder',
        path: '/newfolder',
        posInSet: 3,
        setSize: 1,
        type: DirentType.EditingFolder,
        selected: false,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].type).toBe(DirentType.File)
  expect(result).toEqual({
    ...state,
    items: [state.items[0]],
    focusedIndex: 1,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})

test('cancelEdit - rename file', async () => {
  RendererWorker.registerMockRpc({})

  IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingValue: 'test.txt',
    editingType: ExplorerEditingType.Rename,
    items: [
      {
        name: 'test.txt',
        type: DirentType.EditingFile,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    items: [
      {
        name: 'test.txt',
        type: DirentType.File,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
    ],
    focusedIndex: 0,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})

test('cancelEdit - rename folder', async () => {
  RendererWorker.registerMockRpc({})

  IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 0,
    editingValue: 'test',
    editingType: ExplorerEditingType.Rename,
    items: [
      {
        name: 'test',
        type: DirentType.EditingFolder,
        path: '/test',
        depth: 0,
        selected: false,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result).toEqual({
    ...state,
    items: [
      {
        name: 'test',
        type: DirentType.Directory,
        path: '/test',
        depth: 0,
        selected: false,
      },
    ],
    focusedIndex: 0,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})

test('cancelEdit - create file', async () => {
  RendererWorker.registerMockRpc({})

  IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'test.txt',
    editingType: ExplorerEditingType.CreateFile,
    items: [
      {
        name: 'file1.txt',
        type: DirentType.File,
        path: '/file1.txt',
        depth: 0,
        selected: false,
      },
      {
        name: 'test.txt',
        type: DirentType.EditingFile,
        path: '/test.txt',
        depth: 0,
        selected: false,
      },
    ],
  }

  const result = await cancelEdit(state)
  expect(result.items).toHaveLength(1)
  expect(result.items[0].type).toBe(DirentType.File)
  expect(result).toEqual({
    ...state,
    items: [state.items[0]],
    focusedIndex: 1,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  })
})
