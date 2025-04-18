import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { updateEditingValue } from '../src/parts/UpdateEditingValue/UpdateEditingValue.ts'

test('updateEditingValue - updates state with new value', () => {
  const state = createDefaultState()
  const newValue = 'new value'
  const result = updateEditingValue(state, newValue)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
})

test('updateEditingValue - updates state with new value and input source', () => {
  const state = createDefaultState()
  const newValue = 'new value'
  const result = updateEditingValue(state, newValue, InputSource.User)
  expect(result.editingValue).toBe(newValue)
  expect(result.editingIcon).toBe('')
})

test('updateEditingValue - preserves other state properties', () => {
  const state = createDefaultState()
  const result = updateEditingValue(state, 'new value')
  expect(result.uid).toBe(state.uid)
  expect(result.root).toBe(state.root)
  expect(result.items).toBe(state.items)
})
