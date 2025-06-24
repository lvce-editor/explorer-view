import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'

test('focusPrevious', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  } as any
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  } as any
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - when no focus', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  } as any
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious - when no focus and no dirents', () => {
  const state: ExplorerState = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [],
  } as any
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: -1,
  })
})
