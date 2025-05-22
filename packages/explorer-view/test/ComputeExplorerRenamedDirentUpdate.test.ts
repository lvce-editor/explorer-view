import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../src/parts/Tree/Tree.ts'
import { computeExplorerRenamedDirentUpdate } from '../src/parts/ComputeExplorerRenamedDirentUpdate/ComputeExplorerRenamedDirentUpdate.ts'

test('computeExplorerRenamedDirentUpdate - basic rename', () => {
  const root = '/'
  const parentPath = '/parent'
  const oldUri = '/parent/old'
  const newUri = '/parent/new'
  const children: ExplorerItem[] = [
    {
      name: 'child1',
      type: 1,
      path: '/parent/child1',
      depth: 1,
      selected: false,
      posInSet: 1,
      setSize: 2,
      icon: '',
    },
    {
      name: 'child2',
      type: 1,
      path: '/parent/child2',
      depth: 1,
      selected: false,
      posInSet: 2,
      setSize: 2,
      icon: '',
    },
  ]
  const tree: Tree = {
    'parent/old': [
      {
        name: 'nested',
        type: 1,
      },
    ],
  }

  const result = computeExplorerRenamedDirentUpdate(root, parentPath, oldUri, children, tree, newUri)

  expect(result).toEqual({
    parent: children,
    'parent/new': tree['parent/old'],
  })
})

test('computeExplorerRenamedDirentUpdate - empty tree', () => {
  const root = '/'
  const parentPath = '/parent'
  const oldUri = '/parent/old'
  const newUri = '/parent/new'
  const children: ExplorerItem[] = []
  const tree: Tree = {}

  const result = computeExplorerRenamedDirentUpdate(root, parentPath, oldUri, children, tree, newUri)

  expect(result).toEqual({
    parent: [],
    'parent/new': [],
  })
})

test('computeExplorerRenamedDirentUpdate - deep nested rename', () => {
  const root = '/'
  const parentPath = '/'
  const oldUri = '/old'
  const newUri = '/new'
  const children: ExplorerItem[] = [
    {
      name: 'old',
      type: 1,
      path: '/old',
      depth: 1,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    },
  ]
  const tree: Tree = {
    old: [
      {
        name: 'level1',
        type: 1,
      },
    ],
    'old/level1': [
      {
        name: 'level2',
        type: 1,
      },
    ],
    'old/level1/level2': [
      {
        name: 'level3',
        type: 1,
      },
    ],
    'old/level1/level2/level3': [
      {
        name: 'file.txt',
        type: 2,
      },
    ],
  }

  const result = computeExplorerRenamedDirentUpdate(root, parentPath, oldUri, children, tree, newUri)

  expect(result).toEqual({
    '': children,
    new: tree['old'],
    'new/level1': tree['old/level1'],
    'new/level1/level2': tree['old/level1/level2'],
    'new/level1/level2/level3': tree['old/level1/level2/level3'],
  })
})
