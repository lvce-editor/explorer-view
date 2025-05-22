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
