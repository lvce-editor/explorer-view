import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusFirst from '../src/parts/FocusFirst/FocusFirst.ts'

test('focusFirst', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    height: 600,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
        depth: 1,
        selected: false,
        posInSet: 0,
        setSize: 2,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
        depth: 1,
        selected: false,
        posInSet: 1,
        setSize: 2,
      },
    ],
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no dirents', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    height: 600,
    items: [],
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    height: 600,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
        depth: 1,
        selected: false,
        posInSet: 0,
        setSize: 2,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
        depth: 1,
        selected: false,
        posInSet: 1,
        setSize: 2,
      },
    ],
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})
