import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as CanBeDroppedInto from '../src/parts/CanBeDroppedInto/CanBeDroppedInto.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('canBeDroppedInto - directory', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    selected: false,
    type: DirentType.Directory,
    uri: '/directory',
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanded', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    selected: false,
    type: DirentType.DirectoryExpanded,
    uri: '/directory',
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - directory expanding', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'directory',
    selected: false,
    type: DirentType.DirectoryExpanding,
    uri: '/directory',
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(true)
})

test('canBeDroppedInto - file', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'file.txt',
    selected: false,
    type: DirentType.File,
    uri: '/file.txt',
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})

test('canBeDroppedInto - unknown type', () => {
  const item: ExplorerItem = {
    depth: 0,
    name: 'unknown',
    selected: false,
    type: 999_999,
    uri: '/unknown',
  }
  expect(CanBeDroppedInto.canBeDroppedInto(item)).toBe(false)
})
