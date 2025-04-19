import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.ts'
import { handleBlur } from '../src/parts/HandleBlur/HandleBlur.ts'

test('handleBlur - when not editing, sets focused to false', () => {
  const state = createDefaultState()
  const newState = handleBlur(state)
  expect(newState.focused).toBe(false)
})

test('handleBlur - when editing, keeps state unchanged', () => {
  const state = {
    ...createDefaultState(),
    editingType: ExplorerEditingType.Rename,
  }
  const newState = handleBlur(state)
  expect(newState).toBe(state)
})
