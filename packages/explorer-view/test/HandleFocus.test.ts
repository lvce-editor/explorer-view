import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'

test('handleFocus', async () => {
  const state = createDefaultState()
  const newState = await handleFocus(state)
  expect(newState.focus).toBe(1) // FocusId.List
  expect(newState).not.toBe(state) // Should return a new state object
})
