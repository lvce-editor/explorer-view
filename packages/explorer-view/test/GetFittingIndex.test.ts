import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getFittingIndex } from '../src/parts/GetFittingIndex/GetFittingIndex.ts'

test('getFittingIndex returns the focused folder index', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder', selected: false, type: DirentType.Directory, uri: '/folder' },
    { depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/file.txt' },
  ]

  expect(getFittingIndex(items, 0)).toBe(0)
})

test('getFittingIndex returns the closest parent folder before a focused file', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder', selected: false, type: DirentType.DirectoryExpanded, uri: '/folder' },
    { depth: 1, name: 'file-a.txt', selected: false, type: DirentType.File, uri: '/folder/file-a.txt' },
    { depth: 1, name: 'file-b.txt', selected: false, type: DirentType.File, uri: '/folder/file-b.txt' },
  ]

  expect(getFittingIndex(items, 2)).toBe(0)
})

test('getFittingIndex treats symlink folders as valid insertion targets', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'link', selected: false, type: DirentType.SymLinkFolder, uri: '/link' },
    { depth: 0, name: 'file.txt', selected: false, type: DirentType.File, uri: '/file.txt' },
  ]

  expect(getFittingIndex(items, 1)).toBe(0)
})

test('getFittingIndex returns -1 when there is no folder at or before the start index', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'file-a.txt', selected: false, type: DirentType.File, uri: '/file-a.txt' },
    { depth: 0, name: 'file-b.txt', selected: false, type: DirentType.File, uri: '/file-b.txt' },
  ]

  expect(getFittingIndex(items, 1)).toBe(-1)
})
