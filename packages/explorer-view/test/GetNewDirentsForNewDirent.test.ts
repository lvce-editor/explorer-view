import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForNewDirent } from '../src/parts/GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'

test('getNewDirentsForNewDirent - folder with existing children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        name: 'folder',
        path: '/root/folder',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        name: 'file1.txt',
        path: '/root/folder/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 2,
        name: 'file2.txt',
        path: '/root/folder/file2.txt',
        posInSet: 2,
        selected: false,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  }
  const root = '/root'

  const { focusedIndex, items } = state
  const result = await getNewDirentsForNewDirent(items, focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 1,
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      name: 'file1.txt',
      path: '/root/folder/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
    {
      depth: 2,
      name: 'file2.txt',
      path: '/root/folder/file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
    {
      depth: 2,
      name: '',
      path: '/root/folder',
      posInSet: 3,
      selected: false,
      setSize: 4,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - folder with an expanded child', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 2,
      name: 'sample-files',
      path: '/root/packages/sample-files',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 3,
      name: 'files',
      path: '/root/packages/sample-files/files',
      posInSet: 1,
      selected: true,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    ...['big_buck_bunny.mp4', 'big_buck_bunny.webm', 'echo-hereweare.ogv'].map((name, index) => ({
      depth: 4,
      name,
      path: `/root/packages/sample-files/files/${name}`,
      posInSet: index + 1,
      selected: false,
      setSize: 3,
      type: DirentType.File,
    })),
    {
      depth: 3,
      name: 'package.json',
      path: '/root/packages/sample-files/package.json',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
    {
      depth: 1,
      name: 'scripts',
      path: '/root/scripts',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.Directory,
    },
  ]

  const result = await getNewDirentsForNewDirent(items, 0, DirentType.EditingFolder, '/root')

  expect(result.map(({ depth, name }) => ({ depth, name }))).toEqual([
    { depth: 2, name: 'sample-files' },
    { depth: 3, name: 'files' },
    { depth: 4, name: 'big_buck_bunny.mp4' },
    { depth: 4, name: 'big_buck_bunny.webm' },
    { depth: 4, name: 'echo-hereweare.ogv' },
    { depth: 3, name: 'package.json' },
    { depth: 3, name: '' },
    { depth: 1, name: 'scripts' },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - folder without children', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        name: 'folder',
        path: '/root/folder',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
    ],
  }

  const root = '/root'

  const { focusedIndex, items } = state
  const result = await getNewDirentsForNewDirent(items, focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 1,
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      name: '',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/root/folder']])
})

test('getNewDirentsForNewDirent - no items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [],
  }
  const root = '/root'

  const { focusedIndex, items } = state
  const result = await getNewDirentsForNewDirent(items, focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      depth: 0,
      name: '',
      path: '/root',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - focusedIndex -1 inserts a new file before existing files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [
      {
        depth: 0,
        name: 'file1.txt',
        path: '/root/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  const root = '/root'

  const { focusedIndex, items } = state
  const result = await getNewDirentsForNewDirent(items, focusedIndex, DirentType.File, root, [], true)

  expect(result).toEqual([
    {
      depth: 0,
      name: '',
      path: '/root',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
    {
      depth: 0,
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - focusedIndex -1 inserts a new file between folders and files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const items = [
    {
      depth: 1,
      name: 'folder',
      path: '/root/folder',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      name: 'child.txt',
      path: '/root/folder/child.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
    {
      depth: 1,
      name: 'file.txt',
      path: '/root/file.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.File,
    },
  ]

  const result = await getNewDirentsForNewDirent(items, -1, DirentType.EditingFile, '/root', [], true)

  expect(result.map(({ depth, name, type }) => ({ depth, name, type }))).toEqual([
    { depth: 1, name: 'folder', type: DirentType.DirectoryExpanded },
    { depth: 2, name: 'child.txt', type: DirentType.File },
    { depth: 0, name: '', type: DirentType.EditingFile },
    { depth: 1, name: 'file.txt', type: DirentType.File },
  ])
  expect(mockRpc.invocations).toEqual([])
})

test('getNewDirentsForNewDirent - top-level new folder is inserted first', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [
      {
        depth: 0,
        name: 'file1.txt',
        path: '/root/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  const root = '/root'

  const { focusedIndex, items } = state
  const result = await getNewDirentsForNewDirent(items, focusedIndex, DirentType.EditingFolder, root)

  expect(result).toEqual([
    {
      depth: 0,
      name: '',
      path: '/root',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.EditingFolder,
    },
    {
      depth: 0,
      name: 'file1.txt',
      path: '/root/file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([])
})
