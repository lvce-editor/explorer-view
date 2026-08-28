import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { focus } from '../src/parts/Focus/Focus.js'
import * as FocusId from '../src/parts/FocusId/FocusId.js'

test('focus - assigns focus if not present', () => {
  const state = { ...createDefaultState(), focus: undefined as unknown as number }
  const result = focus(state)
  expect(result.focus).toBeDefined()
  expect(result).not.toBe(state)
})

test('focus - requests focus again if focus present', () => {
  const state = { ...createDefaultState(), focus: 123 }
  const result = focus(state)
  expect(result).toMatchObject({
    focus: 123,
    focused: true,
    version: 2,
  })
  expect(result).not.toBe(state)
})

test('focus - focuses the existing target if explorer is not focused', () => {
  const state = { ...createDefaultState(), focus: FocusId.List, focused: false }
  const result = focus(state)
  expect(result).toMatchObject({
    focus: FocusId.List,
    focused: true,
    version: 2,
  })
  expect(result).not.toBe(state)
})

test('focus - preserves an active rename input', () => {
  const state = {
    ...createDefaultState(),
    editingIndex: 0,
    focus: FocusId.Input,
    focused: true,
  }
  const result = focus(state)
  expect(result).toBe(state)
})
