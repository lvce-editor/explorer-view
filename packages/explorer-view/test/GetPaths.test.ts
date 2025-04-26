import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { Directory, File } from '../src/parts/DirentType/DirentType.ts'
import { getPaths } from '../src/parts/GetPaths/GetPaths.ts'

test('getPaths - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getPaths(items)).toHaveLength(0)
})

test('getPaths - with items', () => {
  const items: readonly ExplorerItem[] = [
    { type: Directory, name: 'folder1', path: '/folder1', depth: 0, selected: false },
    { type: File, name: 'file1.txt', path: '/file1.txt', depth: 0, selected: false },
  ]
  const result = getPaths(items)
  expect(result).toHaveLength(2)
  expect(result[0]).toBe('/folder1')
  expect(result[1]).toBe('/file1.txt')
})
