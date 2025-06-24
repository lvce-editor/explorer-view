import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleInputBlur } from '../src/parts/HandleInputBlur/HandleInputBlur.ts'

test('should cancel edit if there is an error message', async () => {
  const state = { ...createDefaultState(), editingErrorMessage: 'error', editingValue: 'foo' }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('')
})

test('should cancel edit if editing value is empty', async () => {
  const state = { ...createDefaultState(), editingErrorMessage: '', editingValue: '' }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('')
})

test('should accept edit if no error and value present', async () => {
  const state = { ...createDefaultState(), editingErrorMessage: '', editingValue: 'foo', editingType: 0 }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('foo')
})
