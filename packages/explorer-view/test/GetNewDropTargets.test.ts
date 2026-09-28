import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDropTargets } from '../src/parts/GetNewDropTargets/GetNewDropTargets.ts'

test('getNewDropTargets - index -1', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [],
  }
  const result = getNewDropTargets(state, -1)
  expect(result).toEqual([-1])
})

test('getNewDropTargets - cannot be dropped into', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
  }
  const result = getNewDropTargets(state, 0)
  expect(result).toEqual([-1, 0, 1])
})

test('getNewDropTargets - can be dropped into', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'test', selected: false, type: DirentType.Directory, uri: '/test' }],
  }
  const result = getNewDropTargets(state, 0)
  expect(result).toEqual([0])
})
