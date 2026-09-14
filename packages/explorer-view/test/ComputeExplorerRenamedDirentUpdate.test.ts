import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../src/parts/Tree/Tree.ts'
import { computeExplorerRenamedDirentUpdate } from '../src/parts/ComputeExplorerRenamedDirentUpdate/ComputeExplorerRenamedDirentUpdate.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('computeExplorerRenamedDirentUpdate - basic rename', () => {
  const root = '/'
  const parentPath = '/parent'
  const oldUri = '/parent/old'
  const newUri = '/parent/new'
  const children: ExplorerItem[] = [
    {
      depth: 1,
      name: 'child1',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/parent/child1',
    },
    {
      depth: 1,
      name: 'child2',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/parent/child2',
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
      depth: 1,
      name: 'old',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 1,
      uri: '/old',
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

test('computeExplorerRenamedDirentUpdate - preserves expanded renamed folder', () => {
  const root = '/'
  const parentPath = '/parent'
  const oldUri = '/parent/old'
  const newUri = '/parent/new'
  const children: ExplorerItem[] = [
    {
      depth: 2,
      name: 'new',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.Directory,
      uri: '/parent/new',
    },
  ]
  const tree: Tree = {
    'parent/old': [
      {
        name: 'nested',
        type: DirentType.File,
      },
    ],
  }

  const result = computeExplorerRenamedDirentUpdate(root, parentPath, oldUri, children, tree, newUri)

  expect(result).toEqual({
    parent: [
      {
        ...children[0],
        type: DirentType.DirectoryExpanded,
      },
    ],
    'parent/new': tree['parent/old'],
  })
})

test('computeExplorerRenamedDirentUpdate - sorts renamed parent children and updates positions', () => {
  const root = '/'
  const parentPath = '/'
  const oldUri = '/README.md'
  const newUri = '/readme2.md'
  const children: ExplorerItem[] = [
    {
      depth: 1,
      name: 'readme2.md',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/readme2.md',
    },
    {
      depth: 1,
      name: '.nvmrc',
      posInSet: 2,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/.nvmrc',
    },
    {
      depth: 1,
      name: 'package.json',
      posInSet: 3,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/package.json',
    },
    {
      depth: 1,
      name: 'LICENSE',
      posInSet: 4,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/LICENSE',
    },
    {
      depth: 1,
      name: 'eslint.config.js',
      posInSet: 5,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/eslint.config.js',
    },
  ]
  const tree: Tree = {}

  const result = computeExplorerRenamedDirentUpdate(root, parentPath, oldUri, children, tree, newUri)

  expect(result).toEqual({
    '': [
      {
        ...children[1],
        posInSet: 1,
        setSize: 5,
      },
      {
        ...children[4],
        posInSet: 2,
        setSize: 5,
      },
      {
        ...children[3],
        posInSet: 3,
        setSize: 5,
      },
      {
        ...children[2],
        posInSet: 4,
        setSize: 5,
      },
      {
        ...children[0],
        posInSet: 5,
        setSize: 5,
      },
    ],
    'readme2.md': [],
  })
})
