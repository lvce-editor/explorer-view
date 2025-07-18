import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsAccept } from '../src/parts/GetNewDirentsAccept/GetNewDirentsAccept.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('getNewDirentsAccept - create file in root', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string): Promise<any> => {
      if (method === 'FileSystem.writeFile') {
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items: readonly ExplorerItem[] = []
  const editingValue = 'test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const newDirentType = DirentType.File
  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)
  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    path: '/root/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 1,
    name: 'test.txt',
    type: DirentType.File,
    icon: '',
    selected: false,
  })
  expect(result.newFocusedIndex).toBe(0)
})

test('getNewDirentsAccept - create file in subfolder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.writeFile') {
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const newDirentType = DirentType.File

  const editingValue = 'test.txt'
  const focusedIndex = 0
  const root = '/root'
  const pathSeparator = '/'
  const items = [
    {
      path: '/root/folder',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      name: 'folder',
      type: 2,
      icon: '',
      selected: false,
    },
  ]

  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)

  expect(result.dirents).toHaveLength(2)
  expect(result.dirents[1]).toEqual({
    path: '/root/folder/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 2,
    name: 'test.txt',
    type: DirentType.File,
    icon: '',
    selected: false,
  })
  expect(result.newFocusedIndex).toBe(1)
})

test('getNewDirentsAccept - create nested file', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.writeFile') {
        return
      }
      if (method === 'FileSystem.mkdir') {
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const items: readonly ExplorerItem[] = []
  const editingValue = 'a/b/c/test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const newDirentType = DirentType.File
  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)
  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    path: '/root/a/b/c/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 1,
    name: 'a/b/c/test.txt',
    type: DirentType.File,
    icon: '',
    selected: false,
  })
  expect(result.newFocusedIndex).toBe(0)
})

test.skip('getNewDirentsAccept - handle error', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.writeFile') {
        return Promise.reject(new Error('Failed to create file'))
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const editingValue = 'test.txt'
  const focusedIndex = -1
  const root = '/root'
  const pathSeparator = '/'
  const items: readonly ExplorerItem[] = []
  const newDirentType = DirentType.File

  const result = getNewDirentsAccept(items, focusedIndex, editingValue, root, pathSeparator, newDirentType)

  expect(result.dirents).toEqual(items)
  expect(result.newFocusedIndex).toBe(focusedIndex)
})
