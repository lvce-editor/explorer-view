import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.js'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { renderDragData } from '../src/parts/RenderDragData/RenderDragData.js'

test('renderDragData - no items', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    isPointerDown: true,
    items: [],
    pointerDownIndex: 0,
    uid: 123,
  }
  const result = renderDragData(oldState, newState)
  expect(result).toEqual(['Viewlet.setDragData', 123, expect.anything()])
})

test('renderDragData - focused and selected items when pointing at the focused item', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 1,
    isPointerDown: true,
    items: [
      { depth: 1, name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, selected: true, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'b.txt', path: '/workspace/b.txt', posInSet: 2, selected: false, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'c.txt', path: 'file:///workspace/c.txt', posInSet: 3, selected: true, setSize: 3, type: DirentType.File },
    ],
    pointerDownIndex: 1,
    uid: 123,
  }
  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/uri-list',
        },
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/plain',
        },
      ],
      label: '3',
    },
  ])
})

test('renderDragData - focused and selected items when pointing at a selected item', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    isPointerDown: true,
    items: [
      { depth: 1, name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, selected: false, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'b.txt', path: '/workspace/b.txt', posInSet: 2, selected: true, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'c.txt', path: '/workspace/c.txt', posInSet: 3, selected: true, setSize: 3, type: DirentType.File },
    ],
    pointerDownIndex: 1,
    uid: 123,
  }

  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/uri-list',
        },
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/plain',
        },
      ],
      label: '3',
    },
  ])
})

test('renderDragData - only pointed item when pointing outside the selection', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    isPointerDown: true,
    items: [
      { depth: 1, name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, selected: false, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'b.txt', path: '/workspace/b.txt', posInSet: 2, selected: true, setSize: 3, type: DirentType.File },
      { depth: 1, name: 'c.txt', path: '/workspace/c.txt', posInSet: 3, selected: false, setSize: 3, type: DirentType.File },
    ],
    pointerDownIndex: 2,
    uid: 123,
  }

  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        {
          data: 'file:///workspace/c.txt',
          type: 'text/uri-list',
        },
        {
          data: 'file:///workspace/c.txt',
          type: 'text/plain',
        },
      ],
      label: 'c.txt',
    },
  ])
})

test('renderDragData - remote folder has a trailing slash', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    isPointerDown: true,
    items: [
      {
        depth: 1,
        name: 'src',
        path: 'remote-ssh://test-host/workspace/src',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
    pointerDownIndex: 0,
    uid: 123,
  }

  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        { data: 'remote-ssh://test-host/workspace/src/', type: 'text/uri-list' },
        { data: 'remote-ssh://test-host/workspace/src/', type: 'text/plain' },
      ],
      label: 'src',
    },
  ])
})

test('renderDragData - no item for an out-of-range pointer index', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    isPointerDown: true,
    items: [{ depth: 1, name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File }],
    pointerDownIndex: 99,
    uid: 123,
  }

  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        {
          data: '',
          type: 'text/uri-list',
        },
        {
          data: '',
          type: 'text/plain',
        },
      ],
      label: '0',
    },
  ])
})
