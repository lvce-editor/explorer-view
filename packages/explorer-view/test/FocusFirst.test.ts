import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusFirst from '../src/parts/FocusFirst/FocusFirst.ts'

test('focusFirst', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: DirentType.File,
      },
    ],
  } as any
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no dirents', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [],
  } as any
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: DirentType.File,
      },
    ],
  } as any
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})
