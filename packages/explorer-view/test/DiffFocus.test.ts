import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual, diffType } from '../src/parts/DiffFocus/DiffFocus.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diffType should be RenderFocus', () => {
  expect(diffType).toBe(DiffType.RenderFocus)
})

test('isEqual should return true when focused and focus are equal', () => {
  const oldState = {
    ...createDefaultState(),
    focused: true,
    focus: 1,
  }
  const newState = {
    ...createDefaultState(),
    focused: true,
    focus: 1,
  }
  expect(isEqual(oldState, newState)).toBe(true)
})

test('isEqual should return false when focused differs', () => {
  const oldState = {
    ...createDefaultState(),
    focused: true,
    focus: 1,
  }
  const newState = {
    ...createDefaultState(),
    focused: false,
    focus: 1,
  }
  expect(isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when focus differs', () => {
  const oldState = {
    ...createDefaultState(),
    focused: true,
    focus: 1,
  }
  const newState = {
    ...createDefaultState(),
    focused: true,
    focus: 2,
  }
  expect(isEqual(oldState, newState)).toBe(false)
})
