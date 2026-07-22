import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleScrollBarCaptureLost } from '../src/parts/HandleScrollBarCaptureLost/HandleScrollBarCaptureLost.ts'

test('handleScrollBarCaptureLost - deactivates scrollbar', () => {
  const state = {
    ...createDefaultState(),
    scrollBarActive: true,
  }

  const newState = handleScrollBarCaptureLost(state)

  expect(newState.scrollBarActive).toBe(false)
})
