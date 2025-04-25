import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ViewletExplorerFocusIndex from '../src/parts/FocusIndex/FocusIndex.ts'

test('focusIndex - scroll up', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        selected: false,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        selected: true,
      },
    ],
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
  })
})

test('focusIndex - scroll down', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        selected: true,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        selected: false,
      },
    ],
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
  })
})

test('focusIndex - focus container', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        selected: true,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        selected: false,
      },
    ],
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
  })
})

test('focusIndex - unselects all other items', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 3,
    items: [
      {
        depth: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        selected: true,
      },
      {
        depth: 1,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        selected: true,
      },
      {
        depth: 1,
        name: 'index.js',
        path: '/index.js',
        type: DirentType.File,
        selected: true,
      },
    ],
  }
  expect(ViewletExplorerFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    items: [
      {
        selected: false,
      },
      {
        selected: false,
      },
      {
        selected: false,
      },
    ],
  })
})
