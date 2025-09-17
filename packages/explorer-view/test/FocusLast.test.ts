import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as ViewletExplorer from '../src/parts/Create/Create.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusLast from '../src/parts/FocusLast/FocusLast.ts'

test('focusLast', () => {
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no dirents', () => {
  const state: ExplorerState = {
    // @ts-ignore
    ...ViewletExplorer.create(1),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    items: [],
  }
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: -1,
  })
})

test('focusLast - focus already at last', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 1,
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toBe(state)
})
