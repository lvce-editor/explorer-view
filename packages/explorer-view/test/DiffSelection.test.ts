import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffSelection/DiffSelection.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

test('isEqual - same selection', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 0,
    editingSelectionEnd: 5,
  }
  const result = isEqual(state, state)
  expect(result).toBe(true)
})

test('isEqual - different selection', () => {
  const oldState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 0,
    editingSelectionEnd: 5,
  }
  const newState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionStart: 1,
    editingSelectionEnd: 6,
  }
  const result = isEqual(oldState, newState)
  expect(result).toBe(false)
})
