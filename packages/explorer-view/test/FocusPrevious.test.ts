import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'

test('focusPrevious', () => {
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
        depth: 0,
        selected: false,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
        depth: 0,
        selected: false,
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
        depth: 0,
        selected: false,
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
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
        depth: 0,
        selected: false,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
        depth: 0,
        selected: false,
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
        depth: 0,
        selected: false,
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - when no focus', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    height: 600,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
        depth: 0,
        selected: false,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
        depth: 0,
        selected: false,
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
        depth: 0,
        selected: false,
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious - when no focus and no dirents', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    height: 600,
    items: [],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: -1,
  })
})
