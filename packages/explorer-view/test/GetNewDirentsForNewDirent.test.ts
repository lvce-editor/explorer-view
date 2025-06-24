import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForNewDirent } from '../src/parts/GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

test('getNewDirentsForNewDirent - folder with existing children', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        path: '/root/folder',
        posInSet: 1,
        setSize: 1,
        depth: 1,
        name: 'folder',
        type: DirentType.DirectoryExpanded,
        icon: '',
        selected: false,
      },
      {
        path: '/root/folder/file1.txt',
        posInSet: 1,
        setSize: 2,
        depth: 2,
        name: 'file1.txt',
        type: DirentType.File,
        icon: '',
        selected: false,
      },
      {
        path: '/root/folder/file2.txt',
        posInSet: 2,
        setSize: 2,
        depth: 2,
        name: 'file2.txt',
        type: DirentType.File,
        icon: '',
        selected: false,
      },
    ],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 2,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file1.txt',
      posInSet: 1,
      setSize: 4,
      depth: 2,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      path: '/root/folder/file2.txt',
      posInSet: 2,
      setSize: 4,
      depth: 2,
      name: 'file2.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      name: '',
      type: DirentType.File,
      path: '/root/folder',
      depth: 2,
      selected: false,
      posInSet: 3,
      setSize: 4,
      icon: '',
    },
  ])
})

test('getNewDirentsForNewDirent - folder without children', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: 0,
    items: [
      {
        path: '/root/folder',
        posInSet: 1,
        setSize: 1,
        depth: 1,
        name: 'folder',
        type: DirentType.DirectoryExpanded,
        icon: '',
        selected: false,
      },
    ],
  }

  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 2,
      depth: 1,
      name: 'folder',
      type: DirentType.DirectoryExpanded,
      icon: '',
      selected: false,
    },
    {
      name: '',
      type: DirentType.File,
      path: '/root/folder',
      depth: 2,
      selected: false,
      posInSet: 1,
      setSize: 2,
      icon: '',
    },
  ])
})

test('getNewDirentsForNewDirent - no items', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      name: '',
      type: DirentType.File,
      path: '/root',
      depth: 0,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    },
  ])
})

test('getNewDirentsForNewDirent - focusedIndex -1 with existing items', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    focusedIndex: -1,
    items: [
      {
        path: '/root/file1.txt',
        posInSet: 1,
        setSize: 1,
        depth: 0,
        name: 'file1.txt',
        type: DirentType.File,
        icon: '',
        selected: false,
      },
    ],
  }
  const root = '/root'

  const result = await getNewDirentsForNewDirent(state.items, state.focusedIndex, DirentType.File, root)

  expect(result).toEqual([
    {
      path: '/root/file1.txt',
      posInSet: 1,
      setSize: 1,
      depth: 0,
      name: 'file1.txt',
      type: DirentType.File,
      icon: '',
      selected: false,
    },
    {
      name: '',
      type: DirentType.File,
      path: '/root',
      depth: 0,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    },
  ])
})
