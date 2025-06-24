import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { focusNone } from '../src/parts/FocusNone/FocusNone.ts'

test('should return state if focusedIndex is -1', () => {
  const state = { ...createDefaultState(), focusedIndex: -1 }
  const result = focusNone(state)
  expect(result).toBe(state)
})

test('should call focusIndex if focusedIndex is not -1', () => {
  const state = { ...createDefaultState(), focusedIndex: 2 }
  const result = focusNone(state)
  expect(result.focusedIndex).toBe(-1)
})
