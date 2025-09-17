import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusNext from '../src/parts/FocusNext/FocusNext.ts'

test('focusNext', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - when no focus', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusNext - at end', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 2,
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 2,
  })
})
