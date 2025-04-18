import { expect, test } from '@jest/globals'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('saveState - returns correct saved state', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [
      { name: 'test', type: DirentType.DirectoryExpanded, path: '/test', depth: 0 },
      { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 1 },
    ],
    root: '/',
    deltaY: 0,
    minLineY: 0,
    maxLineY: 100,
  }
  ExplorerStates.set(uid, oldState, newState)

  const result = saveState(uid)

  expect(result).toEqual({
    expandedPaths: ['/test'],
    root: '/',
    minLineY: 0,
    maxLineY: 100,
    deltaY: 0,
  })
})

test('saveState - handles empty items', () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [],
    root: '/',
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
  }
  ExplorerStates.set(uid, oldState, newState)

  const result = saveState(uid)

  expect(result).toEqual({
    expandedPaths: [],
    root: '/',
    minLineY: 0,
    maxLineY: 0,
    deltaY: 0,
  })
})
