import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { makeExpanded } from '../src/parts/MakeExpanded/MakeExpanded.ts'

test('makeExpanded - directory', () => {
  const dirent: ExplorerItem = {
    type: DirentType.Directory,
    name: 'test',
    path: '/test',
    depth: 0,
    selected: false,
  }
  const result = makeExpanded(dirent)
  expect(result).toEqual({
    type: DirentType.DirectoryExpanded,
    name: 'test',
    path: '/test',
    depth: 0,
    selected: false,
  })
})

test('makeExpanded - file', () => {
  const dirent: ExplorerItem = {
    type: DirentType.File,
    name: 'test.txt',
    path: '/test.txt',
    depth: 0,
  }
  const result = makeExpanded(dirent)
  expect(result).toEqual(dirent)
})
