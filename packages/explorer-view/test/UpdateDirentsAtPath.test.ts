import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateDirentsAtPath } from '../src/parts/UpdateDirentsAtPath/UpdateDirentsAtPath.ts'

test('updateDirentsAtPath - replaces root children', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 1, name: 'old.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/workspace/old.txt' },
  ]
  const result = updateDirentsAtPath(items, '/workspace', '/workspace', [
    { name: 'b.txt', type: DirentType.File },
    { name: 'src', type: DirentType.Directory },
  ])
  expect(result).toEqual([
    { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 2, type: DirentType.Directory, uri: '/workspace/src' },
    { depth: 1, name: 'b.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File, uri: '/workspace/b.txt' },
  ])
})

test('updateDirentsAtPath - replaces nested children', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 1, type: DirentType.DirectoryExpanded, uri: '/workspace/src' },
    { depth: 2, name: 'old.ts', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/workspace/src/old.ts' },
  ]
  const result = updateDirentsAtPath(items, '/workspace/src', '/workspace', [{ name: 'index.ts', type: DirentType.File }])
  expect(result).toEqual([
    { depth: 1, name: 'src', posInSet: 1, selected: false, setSize: 1, type: DirentType.DirectoryExpanded, uri: '/workspace/src' },
    { depth: 2, name: 'index.ts', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/workspace/src/index.ts' },
  ])
})

test.skip('updateDirentsAtPath - empty items', () => {
  const items: readonly ExplorerItem[] = []
  const path = '/test'
  const root = '/test'
  const newDirents = [{ name: 'file.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('file.txt')
  expect(result[0].type).toBe(DirentType.File)
  expect(result[0].uri).toBe('/test/file.txt')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
})

test.skip('updateDirentsAtPath - update existing items', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder', posInSet: 1, selected: false, setSize: 2, type: DirentType.Directory, uri: '/test/folder' },
    { depth: 0, name: 'file.txt', posInSet: 2, selected: false, setSize: 2, type: DirentType.File, uri: '/test/file.txt' },
  ]
  const path = '/test'
  const root = '/test'
  const newDirents = [
    { name: 'new.txt', type: DirentType.File },
    { name: 'folder', type: DirentType.Directory },
  ]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder')
  expect(result[0].type).toBe(DirentType.Directory)
  expect(result[0].uri).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(2)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].uri).toBe('/test/new.txt')
  expect(result[1].depth).toBe(0)
  expect(result[1].posInSet).toBe(2)
  expect(result[1].setSize).toBe(2)
})

test.skip('updateDirentsAtPath - nested structure', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'folder', posInSet: 1, selected: false, setSize: 1, type: DirentType.Directory, uri: '/test/folder' },
    { depth: 1, name: 'nested.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/test/folder/nested.txt' },
  ]
  const path = '/test/folder'
  const root = '/test'
  const newDirents = [{ name: 'new.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder')
  expect(result[0].type).toBe(DirentType.Directory)
  expect(result[0].uri).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].uri).toBe('/test/folder/new.txt')
  expect(result[1].depth).toBe(1)
  expect(result[1].posInSet).toBe(1)
  expect(result[1].setSize).toBe(1)
})
