import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffValue/DiffValue.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('isEqual - same focus and editing value', () => {
  const state1 = { ...createDefaultState(), focus: FocusId.Input, editingValue: 'test' }
  const state2 = { ...createDefaultState(), focus: FocusId.Input, editingValue: 'test' }

  expect(isEqual(state1, state2)).toBe(true)
})

test('isEqual - different focus', () => {
  const state1 = { ...createDefaultState(), focus: FocusId.Input, editingValue: 'test' }
  const state2 = { ...createDefaultState(), focus: FocusId.List, editingValue: 'test' }

  expect(isEqual(state1, state2)).toBe(false)
})

test('isEqual - different editing value', () => {
  const state1 = { ...createDefaultState(), focus: FocusId.Input, editingValue: 'test1' }
  const state2 = { ...createDefaultState(), focus: FocusId.Input, editingValue: 'test2' }

  expect(isEqual(state1, state2)).toBe(false)
})
