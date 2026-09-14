import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.ts'

test('renameDirent updates state with editing properties', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: [''],
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: '',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingSessionId: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.EditingFile, uri: '/test.txt' }],
  })
})

test('renameDirent updates state with editing properties for folder', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: [''],
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }],
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: '',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingSessionId: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.EditingFolder, uri: '/test' }],
  })
})

test('renameDirent handles empty state', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = await renameDirent(mockState)
  expect(result).toBe(mockState)
})

test('renameDirent preserves icon when entering edit mode', async () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    icons: ['file-icon'],
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
    minLineY: 0,
  }

  const result = await renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIcon: 'file-icon',
    editingIndex: 0,
    editingSelectionEnd: 4,
    editingSelectionStart: 0,
    editingSessionId: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.EditingFile, uri: '/test.txt' }],
  })
})
