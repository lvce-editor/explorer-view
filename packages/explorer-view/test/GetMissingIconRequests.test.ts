import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetMissingIconRequests from '../src/parts/GetMissingIconRequests/GetMissingIconRequests.ts'

test('getMissingIconRequests - empty list', () => {
  const dirents: readonly ExplorerItem[] = []
  const cache: FileIconCache = {}
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([])
})

test('getMissingIconRequests - all in cache', () => {
  const dirents: readonly ExplorerItem[] = [{ type: DirentType.File, path: '/test/file.txt', name: 'file.txt', depth: 0, selected: false }]
  const cache: FileIconCache = {
    '/test/file.txt': 'icon',
  }
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([])
})

test('getMissingIconRequests - some missing', () => {
  const dirents: readonly ExplorerItem[] = [
    { type: DirentType.File, path: '/test/file1.txt', name: 'file1.txt', depth: 0, selected: false },
    { type: DirentType.File, path: '/test/file2.txt', name: 'file2.txt', depth: 0, selected: false },
  ]
  const cache: FileIconCache = {
    '/test/file1.txt': 'icon',
  }
  expect(GetMissingIconRequests.getMissingIconRequests(dirents, cache)).toEqual([
    { type: DirentType.File, name: 'file2.txt', path: '/test/file2.txt' },
  ])
})
