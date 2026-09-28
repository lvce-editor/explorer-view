import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { getIndex } from '../src/parts/GetIndex/GetIndex.ts'

test('getIndex - finds item', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'a', selected: false, type: 1, uri: '/a' },
    { depth: 0, name: 'b', selected: true, type: 2, uri: '/b' },
    { depth: 0, name: 'c', selected: false, type: 1, uri: '/c' },
  ]
  expect(getIndex(items, '/b')).toBe(1)
})

test('getIndex - item not found', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'a', selected: false, type: 1, uri: '/a' },
    { depth: 0, name: 'b', selected: false, type: 2, uri: '/b' },
  ]
  expect(getIndex(items, '/not-found')).toBe(-1)
})

test('getIndex - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getIndex(items, '/any')).toBe(-1)
})
