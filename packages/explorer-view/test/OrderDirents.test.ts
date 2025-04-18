import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { orderDirents } from '../src/parts/OrderDirents/OrderDirents.js'

test('empty array returns empty array', () => {
  expect(orderDirents([])).toEqual([])
})

test('orders single top level item', () => {
  const input: readonly ExplorerItem[] = [{ name: 'file1', type: 1, path: '/file1', depth: 1 }]
  expect(orderDirents(input)).toEqual(input)
})

test('orders multiple top level items', () => {
  const input: readonly ExplorerItem[] = [
    { name: 'file2', type: 1, path: '/file2', depth: 1 },
    { name: 'file1', type: 1, path: '/file1', depth: 1 },
  ]
  const expected = [
    { name: 'file2', type: 1, path: '/file2', depth: 1 },
    { name: 'file1', type: 1, path: '/file1', depth: 1 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})

test('orders nested items correctly', () => {
  const input: readonly ExplorerItem[] = [
    { name: 'file1', type: 1, path: '/folder1/file1', depth: 2 },
    { name: 'folder1', type: 2, path: '/folder1', depth: 1 },
    { name: 'file2', type: 1, path: '/folder2/file2', depth: 2 },
    { name: 'folder2', type: 2, path: '/folder2', depth: 1 },
  ]
  const expected = [
    { name: 'folder1', type: 2, path: '/folder1', depth: 1 },
    { name: 'file1', type: 1, path: '/folder1/file1', depth: 2 },
    { name: 'folder2', type: 2, path: '/folder2', depth: 1 },
    { name: 'file2', type: 1, path: '/folder2/file2', depth: 2 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})

test('orders deeply nested items correctly', () => {
  const input: readonly ExplorerItem[] = [
    { name: 'file1', type: 1, path: '/folder1/subfolder/file1', depth: 3 },
    { name: 'subfolder', type: 2, path: '/folder1/subfolder', depth: 2 },
    { name: 'folder1', type: 2, path: '/folder1', depth: 1 },
    { name: 'folder2', type: 2, path: '/folder2', depth: 1 },
  ]
  const expected = [
    { name: 'folder1', type: 2, path: '/folder1', depth: 1 },
    { name: 'subfolder', type: 2, path: '/folder1/subfolder', depth: 2 },
    { name: 'file1', type: 1, path: '/folder1/subfolder/file1', depth: 3 },
    { name: 'folder2', type: 2, path: '/folder2', depth: 1 },
  ]
  expect(orderDirents(input)).toEqual(expected)
})
