import { expect, test } from '@jest/globals'
import { handleDragOver } from '../src/parts/HandleDragOver/HandleDragOver.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test.skip('handleDragOver - returns same state when drop targets are equal', () => {
  const state = {
    ...createDefaultState(),
    dropTargets: [1, 2],
  }
  const result = handleDragOver(state, 100, 100)
  expect(result).toBe(state)
})

test('handleDragOver - returns new state when drop targets change', () => {
  const state = {
    ...createDefaultState(),
    dropTargets: [1],
  }
  const result = handleDragOver(state, 200, 200)
  expect(result).not.toBe(state)
  expect(result.dropTargets).not.toEqual(state.dropTargets)
})

test.skip('handleDragOver - throws error for invalid coordinates', () => {
  const state = createDefaultState()
  expect(() => handleDragOver(state, NaN, 100)).toThrow()
  expect(() => handleDragOver(state, 100, NaN)).toThrow()
})
