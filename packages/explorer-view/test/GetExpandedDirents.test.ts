import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { Directory, DirectoryExpanded, File } from '../src/parts/DirentType/DirentType.ts'
import { getExpandedDirents } from '../src/parts/GetExpandedDirents/GetExpandedDirents.ts'

test('getExpandedDirents - empty array', () => {
  const items: readonly ExplorerItem[] = []
  expect(getExpandedDirents(items)).toHaveLength(0)
})

test('getExpandedDirents - no expanded items', () => {
  const items: readonly ExplorerItem[] = [
    { type: Directory, name: 'folder1', path: '/folder1', depth: 0, selected: false },
    { type: File, name: 'file1.txt', path: '/file1.txt', depth: 0, selected: false },
  ]
  expect(getExpandedDirents(items)).toHaveLength(0)
})

test('getExpandedDirents - with expanded items', () => {
  const items: readonly ExplorerItem[] = [
    { type: DirectoryExpanded, name: 'folder1', path: '/folder1', depth: 0, selected: false },
    { type: File, name: 'file1.txt', path: '/file1.txt', depth: 0, selected: false },
  ]
  const result = getExpandedDirents(items)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('folder1')
})
