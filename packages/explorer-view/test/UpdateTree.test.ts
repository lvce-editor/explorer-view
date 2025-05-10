import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateTree } from '../src/parts/UpdateTree/UpdateTree.ts'

test('updateTree - empty tree', () => {
  const tree = {}
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - existing tree', () => {
  const tree: Record<string, readonly ExplorerItem[]> = {
    '/test': [{ name: 'old.txt', type: DirentType.File, path: '/test/old.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' }],
  }
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { name: 'new.txt', type: DirentType.File, path: '/test/new.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': newDirents,
  })
})

test('updateTree - nested path', () => {
  const tree: Record<string, readonly ExplorerItem[]> = {
    '/test': [{ name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' }],
  }
  const path = '/test/folder'
  const newDirents: readonly ExplorerItem[] = [
    { name: 'nested.txt', type: DirentType.File, path: '/test/folder/nested.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': [{ name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' }],
    '/test/folder': [
      { name: 'nested.txt', type: DirentType.File, path: '/test/folder/nested.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
    ],
  })
})

test.only('updateTree - rename folder with nested items', () => {
  const tree = {
    '/test': [{ name: 'folder', type: DirentType.Directory, path: '/test/folder', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' }],
    '/test/folder': [
      { name: 'nested.txt', type: DirentType.File, path: '/test/folder/nested.txt', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
    ],
  }
  const path = '/test'
  const newDirents: readonly ExplorerItem[] = [
    { name: 'renamed', type: DirentType.Directory, path: '/test/renamed', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' },
  ]
  const result = updateTree(tree, path, newDirents)
  expect(result).toEqual({
    '/test': [{ name: 'renamed', type: DirentType.Directory, path: '/test/renamed', depth: 0, selected: false, posInSet: 1, setSize: 1, icon: '' }],
    '/test/renamed': [
      {
        name: 'nested.txt',
        type: DirentType.File,
        path: '/test/renamed/nested.txt',
        depth: 0,
        selected: false,
        posInSet: 1,
        setSize: 1,
        icon: '',
      },
    ],
  })
})
