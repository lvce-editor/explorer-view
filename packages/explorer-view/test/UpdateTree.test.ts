import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateTree } from '../src/parts/UpdateTree/UpdateTree.ts'

test('updateTree - empty tree', () => {
  const tree = {}
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'file.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/test/file.txt' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - existing tree', () => {
  const tree = {
    '/test': [{ depth: 0, name: 'old.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/test/old.txt' }],
  }
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'new.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/test/new.txt' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - nested path', () => {
  const tree = {
    '/test': [{ depth: 0, name: 'folder', posInSet: 1, selected: false, setSize: 1, type: DirentType.Directory, uri: '/test/folder' }],
  }
  const path = '/test/folder'
  const newDirents: readonly ExplorerItem[] = [
    { depth: 0, name: 'nested.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/test/folder/nested.txt' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': tree['/test'],
    '/test/folder': newDirents,
  })
})
