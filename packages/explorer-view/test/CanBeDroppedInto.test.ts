import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as CanBeDroppedInto from '../src/parts/CanBeDroppedInto/CanBeDroppedInto.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('canBeDroppedInto - directory', () => {
  const item: ExplorerItem = {
    name: 'directory',
    type: DirentType.Directory,
    path: '/directory',
    depth: 0,
    selected: false,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanded', () => {
  const item: ExplorerItem = {
    name: 'directory',
    type: DirentType.DirectoryExpanded,
    path: '/directory',
    depth: 0,
    selected: false,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanding', () => {
  const item: ExplorerItem = {
    name: 'directory',
    type: DirentType.DirectoryExpanding,
    path: '/directory',
    depth: 0,
    selected: false,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - file', () => {
  const item: ExplorerItem = {
    name: 'file.txt',
    type: DirentType.File,
    path: '/file.txt',
    depth: 0,
    selected: false,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})

test('canBeDroppedInto - unknown type', () => {
  const item: ExplorerItem = {
    name: 'unknown',
    type: 999_999,
    path: '/unknown',
    depth: 0,
    selected: false,
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})
