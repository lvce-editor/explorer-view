import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'

test('handleFocus', async () => {
  const state = createDefaultState()
  const newState = await handleFocus(state)
  expect(newState.focus).toBe(1) // FocusId.List
  expect(newState).not.toBe(state) // Should return a new state object
})

test('handleFocus - pending focus overrides stale focused index', async () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    pendingFocusedIndex: 2,
  }
  const newState = await handleFocus(state)
  expect(newState.focused).toBe(true)
  expect(newState.focusedIndex).toBe(2)
  expect(newState.pendingFocusedIndex).toBe(-1)
})
