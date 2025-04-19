import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { getIndex } from '../src/parts/GetIndex/GetIndex.ts'

test('getIndex - finds item', () => {
  const items: readonly ExplorerItem[] = [
    { path: '/a', name: 'a', type: 1, depth: 0 },
    { path: '/b', name: 'b', type: 2, depth: 0 },
    { path: '/c', name: 'c', type: 1, depth: 0 },
  ]
  expect(getIndex(items, '/b')).toBe(1)
})

test('getIndex - item not found', () => {
  const items: readonly ExplorerItem[] = [
    { path: '/a', name: 'a', type: 1, depth: 0 },
    { path: '/b', name: 'b', type: 2, depth: 0 },
  ]
  expect(getIndex(items, '/not-found')).toBe(-1)
})

test('getIndex - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getIndex(items, '/any')).toBe(-1)
})
