import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'

test('diff2 - empty states', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = createDefaultState()
  ExplorerStates.set(uid, oldState, newState)
  const result = diff2(uid)
  expect(result).toEqual([4])
})

test('diff2 - different states', () => {
  const uid = 2
  const oldState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0 }],
  }
  const newState = {
    ...createDefaultState(),
    items: [{ name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0 }],
  }
  ExplorerStates.set(uid, oldState, newState)
  const result = diff2(uid)
  expect(result).toEqual([4])
})
