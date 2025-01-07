import { expect, test } from '@jest/globals'
import * as ViewletExplorer from '../src/parts/Create/Create.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusLast from '../src/parts/FocusLast/FocusLast.ts'

test('focusLast', () => {
  const state = {
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no dirents', () => {
  const state = {
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
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
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
  expect(ViewletExplorerFocusLast.focusLast(state)).toBe(state)
})
