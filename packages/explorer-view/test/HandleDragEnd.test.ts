import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDragEnd } from '../src/parts/HandleDragEnd/HandleDragEnd.ts'

test('resets drag and pointer state', () => {
  const state = {
    ...createDefaultState(),
    dropTargets: [1],
    isPointerDown: true,
    pointerDownIndex: 2,
  }

  expect(handleDragEnd(state)).toEqual({
    ...state,
    dropTargets: [],
    isPointerDown: false,
    pointerDownIndex: -1,
  })
})
