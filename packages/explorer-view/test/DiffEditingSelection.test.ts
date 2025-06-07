import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { diffEditingSelection } from '../src/parts/DiffEditingSelection/DiffEditingSelection.ts'

test('diffEditingSelection - returns undefined when selection is the same', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 0,
    editingSelectionEnd: 5,
  }
  const result = diffEditingSelection(state, 0, 5)
  expect(result).toBe(undefined)
})

test('diffEditingSelection - returns new selection when different', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 0,
    editingSelectionEnd: 5,
  }
  const result = diffEditingSelection(state, 1, 6)
  expect(result).toEqual({ start: 1, end: 6 })
})
