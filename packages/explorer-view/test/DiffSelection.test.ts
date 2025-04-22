import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual, diffType } from '../src/parts/DiffSelection/DiffSelection.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diffType should be RenderSelection', () => {
  expect(diffType).toBe(DiffType.RenderSelection)
})

test('isEqual - same selection', () => {
  const state = {
    ...createDefaultState(),
    editingSelection: { start: 0, end: 5 },
  }
  const result = isEqual(state, state)
  expect(result).toBe(true)
})

test('isEqual - different selection', () => {
  const oldState = {
    ...createDefaultState(),
    editingSelection: { start: 0, end: 5 },
  }
  const newState = {
    ...createDefaultState(),
    editingSelection: { start: 1, end: 6 },
  }
  const result = isEqual(oldState, newState)
  expect(result).toBe(false)
})
