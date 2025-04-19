import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { cancelEdit } from '../src/parts/CancelEdit/CancelEdit.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('cancelEdit', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingIndex: 1,
    editingValue: 'test.txt',
    editingType: ExplorerEditingType.CreateFile,
  }

  const result = cancelEdit(state)
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
