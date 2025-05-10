import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateDirentsAtPath } from '../src/parts/UpdateDirentsAtPath/UpdateDirentsAtPath.ts'

test.skip('updateDirentsAtPath - empty items', () => {
  const items: readonly ExplorerItem[] = []
  const path = '/test'
  const root = '/test'
  const newDirents = [{ name: 'file.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(1)
  expect(result[0].name).toBe('file.txt')
  expect(result[0].type).toBe(DirentType.File)
  expect(result[0].path).toBe('/test/file.txt')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
})

test.skip('updateDirentsAtPath - update existing items', () => {
  const items: readonly ExplorerItem[] = [
    { name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false, posInSet: 1, setSize: 2, icon: '' },
    { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false, posInSet: 2, setSize: 2, icon: '' },
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
  expect(result[0].path).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(2)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].path).toBe('/test/new.txt')
  expect(result[1].depth).toBe(0)
  expect(result[1].posInSet).toBe(2)
  expect(result[1].setSize).toBe(2)
})

test.skip('updateDirentsAtPath - nested structure', () => {
  const items: readonly ExplorerItem[] = [
    { name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
    { name: 'nested.txt', type: DirentType.File, path: '/test/folder/nested.txt', depth: 1, selected: false, posInSet: 1, setSize: 1, icon: '' },
  ]
  const path = '/test/folder'
  const root = '/test'
  const newDirents = [{ name: 'new.txt', type: DirentType.File }]
  const result = updateDirentsAtPath(items, path, root, newDirents)
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder')
  expect(result[0].type).toBe(DirentType.Directory)
  expect(result[0].path).toBe('/test/folder')
  expect(result[0].depth).toBe(0)
  expect(result[0].posInSet).toBe(1)
  expect(result[0].setSize).toBe(1)
  expect(result[1].name).toBe('new.txt')
  expect(result[1].type).toBe(DirentType.File)
  expect(result[1].path).toBe('/test/folder/new.txt')
  expect(result[1].depth).toBe(1)
  expect(result[1].posInSet).toBe(1)
  expect(result[1].setSize).toBe(1)
})
