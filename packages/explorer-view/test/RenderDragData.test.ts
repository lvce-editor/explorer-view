import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.js'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.js'
import { renderDragData } from '../src/parts/RenderDragData/RenderDragData.js'

test('renderDragData - no items', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    items: [],
    focusedIndex: 0,
    uid: 123,
  }
  const result = renderDragData(oldState, newState)
  expect(JSON.stringify(result)).toBe(
    JSON.stringify([
      'Viewlet.setDragData',
      123,
      [
        { type: 'text/uri-list', data: '' },
        { type: 'text/plain', data: '' },
      ],
    ]),
  )
})

test('renderDragData - one selected item', () => {
  const oldState: ExplorerState = createDefaultState()
  const items: readonly ExplorerItem[] = [{ name: 'file.txt', type: 1, path: '/file.txt', depth: 0, selected: true }]
  const newState: ExplorerState = {
    ...oldState,
    items,
    focusedIndex: 0,
    uid: 456,
  }
  const result = renderDragData(oldState, newState)
  expect(JSON.stringify(result)).toBe(
    JSON.stringify([
      'Viewlet.setDragData',
      456,
      [
        { type: 'text/uri-list', data: 'file:///file.txt' },
        { type: 'text/plain', data: 'file:///file.txt' },
      ],
    ]),
  )
  // @ts-ignore
  expect(result[2].label).toBe('/file.txt')
})

test('renderDragData - multiple selected items', () => {
  const oldState: ExplorerState = createDefaultState()
  const items: readonly ExplorerItem[] = [
    { name: 'a.txt', type: 1, path: '/a.txt', depth: 0, selected: true },
    { name: 'b.txt', type: 1, path: '/b.txt', depth: 0, selected: true },
  ]
  const newState: ExplorerState = {
    ...oldState,
    items,
    focusedIndex: 0,
    uid: 789,
  }
  const result = renderDragData(oldState, newState)
  expect(JSON.stringify(result)).toBe(
    JSON.stringify([
      'Viewlet.setDragData',
      789,
      [
        { type: 'text/uri-list', data: 'file:///a.txt\nfile:///b.txt' },
        { type: 'text/plain', data: 'file:///a.txt\nfile:///b.txt' },
      ],
    ]),
  )
  // @ts-ignore
  expect(result[2].label).toBe('2')
})

test('renderDragData - focusedIndex not selected', () => {
  const oldState: ExplorerState = createDefaultState()
  const items: readonly ExplorerItem[] = [
    { name: 'a.txt', type: 1, path: '/a.txt', depth: 0, selected: false },
    { name: 'b.txt', type: 1, path: '/b.txt', depth: 0, selected: false },
  ]
  const newState: ExplorerState = {
    ...oldState,
    items,
    focusedIndex: 1,
    uid: 321,
  }
  const result = renderDragData(oldState, newState)
  expect(JSON.stringify(result)).toBe(
    JSON.stringify([
      'Viewlet.setDragData',
      321,
      [
        { type: 'text/uri-list', data: 'file:///b.txt' },
        { type: 'text/plain', data: 'file:///b.txt' },
      ],
    ]),
  )
  // @ts-ignore
  expect(result[2].label).toBe('/b.txt')
})
