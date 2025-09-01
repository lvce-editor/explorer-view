import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { cancelTypeAhead } from '../src/parts/CancelTypeAhead/CancelTypeAhead.ts'

test('cancelTypeAhead - clears focusWord only', () => {
  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusWord: 'abc',
    focusedIndex: 2,
  }

  const result = cancelTypeAhead(initialState)

  expect(result.focusWord).toBe('')
  expect(result.focusedIndex).toBe(2)
})
