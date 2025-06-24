import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { toCollapsedDirent } from '../src/parts/ToCollapsedDirent/ToCollapsedDirent.ts'

test('should collapse expanded directory to regular directory', () => {
  const expandedDir: ExplorerItem = {
    name: 'test-dir',
    type: DirentType.DirectoryExpanded,
    path: '/test/test-dir',
    depth: 1,
    selected: false,
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    name: 'test-dir',
    type: DirentType.Directory,
    path: '/test/test-dir',
    depth: 1,
    selected: false,
  })
})

test('should return unchanged item for non-expanded directory', () => {
  const regularDir: ExplorerItem = {
    name: 'test-dir',
    type: DirentType.Directory,
    path: '/test/test-dir',
    depth: 1,
    selected: false,
  }

  const result = toCollapsedDirent(regularDir)

  expect(result).toBe(regularDir)
})

test('should return unchanged item for file', () => {
  const file: ExplorerItem = {
    name: 'test-file.txt',
    type: DirentType.File,
    path: '/test/test-file.txt',
    depth: 1,
    selected: false,
  }

  const result = toCollapsedDirent(file)

  expect(result).toBe(file)
})

test('should return unchanged item for symlink', () => {
  const symlink: ExplorerItem = {
    name: 'test-symlink',
    type: DirentType.Symlink,
    path: '/test/test-symlink',
    depth: 1,
    selected: false,
  }

  const result = toCollapsedDirent(symlink)

  expect(result).toBe(symlink)
})

test('should preserve all properties when collapsing expanded directory', () => {
  const expandedDir: ExplorerItem = {
    name: 'test-dir',
    type: DirentType.DirectoryExpanded,
    path: '/test/test-dir',
    depth: 2,
    selected: true,
    posInSet: 3,
    setSize: 5,
    icon: 'folder-icon',
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    name: 'test-dir',
    type: DirentType.Directory,
    path: '/test/test-dir',
    depth: 2,
    selected: true,
    posInSet: 3,
    setSize: 5,
    icon: 'folder-icon',
  })
})
