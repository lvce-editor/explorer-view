import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDropTargets } from '../src/parts/GetNewDropTargets/GetNewDropTargets.ts'

test('getNewDropTargets - index -1', () => {
  const state = {
    ...createDefaultState(),
    items: [],
  }
  const result = getNewDropTargets(state, 0, 0)
  expect(result).toEqual([-1])
})

test('getNewDropTargets - cannot be dropped into', () => {
  const state = {
    ...createDefaultState(),
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0 }],
  }
  const result = getNewDropTargets(state, 0, 0)
  expect(result).toEqual([])
})

test('getNewDropTargets - can be dropped into', () => {
  const state = {
    ...createDefaultState(),
    items: [{ name: 'test', type: DirentType.Directory, path: '/test', depth: 0 }],
  }
  const result = getNewDropTargets(state, 0, 0)
  expect(result).toEqual([0])
})
