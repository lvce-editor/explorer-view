import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsExpandedDirectory from '../src/parts/IsExpandedDirectory/IsExpandedDirectory.ts'

test('isExpandedDirectory - expanded directory', () => {
  const item: ExplorerItem = {
    name: 'test',
    type: DirentType.DirectoryExpanded,
    path: '/test',
    depth: 0,
    selected: false,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(true)
})

test('isExpandedDirectory - collapsed directory', () => {
  const item: ExplorerItem = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})

test('isExpandedDirectory - expanding directory', () => {
  const item: ExplorerItem = {
    name: 'test',
    type: DirentType.DirectoryExpanding,
    path: '/test',
    depth: 0,
    selected: false,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})

test('isExpandedDirectory - file', () => {
  const item: ExplorerItem = {
    name: 'test.txt',
    type: DirentType.File,
    path: '/test.txt',
    depth: 0,
    selected: false,
  }
  expect(IsExpandedDirectory.isExpandedDirectory(item)).toBe(false)
})
