import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { handleDragLeave } from '../src/parts/HandleDragLeave/HandleDragLeave.js'

test('handleDragLeave returns state unchanged', () => {
  const state = createDefaultState()
  const result = handleDragLeave(state)
  expect(result).toBe(state)
})

// Uncomment when functionality is implemented
// test('handleDragLeave clears dropTargets', () => {
//   const state = {
//     ...createDefaultState(),
//     dropTargets: ['some-target']
//   }
//   const result = handleDragLeave(state)
//   expect(result.dropTargets).toEqual([])
// })
