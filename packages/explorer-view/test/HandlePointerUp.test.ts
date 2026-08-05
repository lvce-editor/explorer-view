import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handlePointerUp } from '../src/parts/HandlePointerUp/HandlePointerUp.ts'

test('resets pointer drag state', () => {
  const state = {
    ...createDefaultState(),
    isPointerDown: true,
    pointerDownIndex: 3,
  }

  expect(handlePointerUp(state)).toEqual({
    ...state,
    isPointerDown: false,
    pointerDownIndex: -1,
  })
})

test('returns the same state when pointer drag state is already reset', () => {
  const state = createDefaultState()
  expect(handlePointerUp(state)).toBe(state)
})
