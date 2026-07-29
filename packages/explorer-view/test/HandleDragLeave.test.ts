import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDragLeave } from '../src/parts/HandleDragLeave/HandleDragLeave.ts'

test('handleDragLeave returns state unchanged when there are no drop targets', () => {
  const state = createDefaultState()
  const result = handleDragLeave(state)
  expect(result).toBe(state)
})

test('handleDragLeave clears drop targets', () => {
  const state = {
    ...createDefaultState(),
    dropTargets: [1],
  }
  const result = handleDragLeave(state)
  expect(result).toEqual({
    ...state,
    dropTargets: [],
  })
})
