import { test, expect } from '@jest/globals'
import { treeToArray } from '../src/parts/TreeToArray/TreeToArray.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'

test('treeToArray - empty tree', () => {
  const map: Record<string, readonly ExplorerItem[]> = {}
  const root = '/test'
  expect(treeToArray(map, root)).toEqual([])
})

test('treeToArray - single file', () => {
  const map: Record<string, readonly ExplorerItem[]> = {
    '/test': [{ name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('file.txt')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
})

test('treeToArray - nested structure', () => {
  const map: Record<string, readonly ExplorerItem[]> = {
    '/test': [
      { name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false },
      { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false },
    ],
    '/test/folder': [{ name: 'nested.txt', type: DirentType.File, path: '/test/folder/nested.txt', depth: 1, selected: false }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toHaveLength(3)
  expect(result[0].name).toBe('folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(2)
  expect(result[1].name).toBe('nested.txt')
  expect(result[1].depth).toBe(1)
  expect(result[1].posInSet).toBe(1)
  expect(result[1].setSize).toBe(1)
  expect(result[2].name).toBe('file.txt')
  expect(result[2].depth).toBe(0)
  expect(result[2].posInSet).toBe(2)
  expect(result[2].setSize).toBe(2)
})

test('treeToArray - deep nested structure', () => {
  const map: Record<string, readonly ExplorerItem[]> = {
    '/test': [{ name: 'folder1', type: DirentType.Directory, path: '/test/folder1', depth: 0, selected: false }],
    '/test/folder1': [{ name: 'folder2', type: DirentType.Directory, path: '/test/folder1/folder2', depth: 1, selected: false }],
    '/test/folder1/folder2': [{ name: 'deep.txt', type: DirentType.File, path: '/test/folder1/folder2/deep.txt', depth: 2, selected: false }],
  }
  const root = '/test'
  const result = treeToArray(map, root)
  expect(result).toHaveLength(3)
  expect(result[0].name).toBe('folder1')
  expect(result[0].depth).toBe(0)
  expect(result[1].name).toBe('folder2')
  expect(result[1].depth).toBe(1)
  expect(result[2].name).toBe('deep.txt')
  expect(result[2].depth).toBe(2)
})
