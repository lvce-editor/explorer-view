import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.ts'

test('renameDirent updates state with editing properties', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'test.txt',
    focus: FocusId.Input,
  })
})

test.skip('renameDirent handles empty state', () => {
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }

  const result = renameDirent(mockState)
  expect(result).toEqual({
    ...mockState,
    editingIndex: -1,
    editingType: ExplorerEditingType.Rename,
    editingValue: '',
    focus: FocusId.Input,
  })
})
