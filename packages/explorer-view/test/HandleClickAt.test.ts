import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickAt } from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { LeftClick } from '../src/parts/MouseEventType/MouseEventType.ts'

test('handleClickAt - non left click', async () => {
  const state = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, 2, shiftKey, ctrlKey, 0, 0)
  expect(result).toBe(state)
})

test('handleClickAt - left click', async () => {
  const state = createDefaultState()
  const shiftKey = false
  const ctrlKey = false
  const result = await handleClickAt(state, LeftClick, shiftKey, ctrlKey, 0, 0)
  expect(result).toBeDefined()
})
