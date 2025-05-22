import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.ts'

test('renameDirent updates state with editing properties', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
    icons: [''],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    items: [{ name: 'test.txt', type: DirentType.EditingFile, path: '/test.txt', depth: 0, selected: false }],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    editingIcon: '',
    editingSelectionStart: 0,
    editingSelectionEnd: 8,
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  })
})

test('renameDirent updates state with editing properties for folder', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0, selected: false }],
    icons: [''],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    items: [{ name: 'test', type: DirentType.EditingFolder, path: '/test', depth: 0, selected: false }],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test',
    editingIcon: '',
    editingSelectionStart: 0,
    editingSelectionEnd: 4,
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  })
})

test('renameDirent handles empty state', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = renameDirent(mockState)
  expect(result).toBe(mockState)
})

test('renameDirent preserves icon when entering edit mode', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    minLineY: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false, icon: 'file-icon' }],
    icons: ['file-icon'],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    items: [{ name: 'test.txt', type: DirentType.EditingFile, path: '/test.txt', depth: 0, selected: false, icon: 'file-icon' }],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    editingIcon: 'file-icon',
    editingSelectionStart: 0,
    editingSelectionEnd: 8,
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  })
})
