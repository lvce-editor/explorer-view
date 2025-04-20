import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { diff2 } from '../src/parts/Diff2/Diff2.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { set } from '../src/parts/ExplorerStates/ExplorerStates.ts'

test('diff2 - empty states', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    items: [],
  }
  set(uid, oldState, newState)
  const result = diff2(uid)
  expect(result).toEqual([4])
})

test('diff2 - different states', () => {
  const uid = 2
  const oldState: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0, selected: false }],
  }
  const newState: ExplorerState = {
    ...createDefaultState(),
    items: [{ name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: false }],
  }
  ExplorerStates.set(uid, oldState, newState)
  const result = diff2(uid)
  expect(result).toEqual([4])
})
