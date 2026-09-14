import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { toCollapsedDirent } from '../src/parts/ToCollapsedDirent/ToCollapsedDirent.ts'

test('should collapse expanded directory to regular directory', () => {
  const expandedDir: ExplorerItem = {
    depth: 1,
    name: 'test-dir',
    selected: false,
    type: DirentType.DirectoryExpanded,
    uri: '/test/test-dir',
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    depth: 1,
    name: 'test-dir',
    selected: false,
    type: DirentType.Directory,
    uri: '/test/test-dir',
  })
})

test('should return unchanged item for non-expanded directory', () => {
  const regularDir: ExplorerItem = {
    depth: 1,
    name: 'test-dir',
    selected: false,
    type: DirentType.Directory,
    uri: '/test/test-dir',
  }

  const result = toCollapsedDirent(regularDir)

  expect(result).toBe(regularDir)
})

test('should return unchanged item for file', () => {
  const file: ExplorerItem = {
    depth: 1,
    name: 'test-file.txt',
    selected: false,
    type: DirentType.File,
    uri: '/test/test-file.txt',
  }

  const result = toCollapsedDirent(file)

  expect(result).toBe(file)
})

test('should return unchanged item for symlink', () => {
  const symlink: ExplorerItem = {
    depth: 1,
    name: 'test-symlink',
    selected: false,
    type: DirentType.Symlink,
    uri: '/test/test-symlink',
  }

  const result = toCollapsedDirent(symlink)

  expect(result).toBe(symlink)
})

test('should preserve all properties when collapsing expanded directory', () => {
  const expandedDir: ExplorerItem = {
    depth: 2,
    name: 'test-dir',
    posInSet: 3,
    selected: true,
    setSize: 5,
    type: DirentType.DirectoryExpanded,
    uri: '/test/test-dir',
  }

  const result = toCollapsedDirent(expandedDir)

  expect(result).toEqual({
    depth: 2,
    name: 'test-dir',
    posInSet: 3,
    selected: true,
    setSize: 5,
    type: DirentType.Directory,
    uri: '/test/test-dir',
  })
})
