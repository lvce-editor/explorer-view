import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickCurrentButKeepFocus } from '../src/parts/HandleClickCurrentButKeepFocus/HandleClickCurrentButKeepFocus.ts'

test('handleClickCurrentButKeepFocus', async () => {
  const state = createDefaultState()
  const newState = await handleClickCurrentButKeepFocus(state)
  expect(newState).toBeDefined()
})
