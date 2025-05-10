import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getNewDirentsAccept } from '../src/parts/GetNewDirentsAccept/GetNewDirentsAccept.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('getNewDirentsAccept - create file in root', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string): Promise<any> => {
      if (method === 'FileSystem.writeFile') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state = {
    ...defaultState,
    editingValue: 'test.txt',
    focusedIndex: -1,
    root: '/root',
    pathSeparator: '/',
  }

  const result = await getNewDirentsAccept(state, 1)

  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    path: '/root/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 1,
    name: 'test.txt',
    type: 1,
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
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state = {
    ...defaultState,
    editingValue: 'test.txt',
    focusedIndex: 0,
    root: '/root',
    pathSeparator: '/',
    items: [
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
    ],
  }

  const result = getNewDirentsAccept(state, 1)

  expect(result.dirents).toHaveLength(2)
  expect(result.dirents[1]).toEqual({
    path: '/root/folder/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 2,
    name: 'test.txt',
    type: 1,
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
        return Promise.resolve()
      }
      if (method === 'FileSystem.mkdir') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const defaultState = createDefaultState()
  const state = {
    ...defaultState,
    editingValue: 'a/b/c/test.txt',
    focusedIndex: -1,
    root: '/root',
    pathSeparator: '/',
  }

  const result = getNewDirentsAccept(state, 1)

  expect(result.dirents).toHaveLength(1)
  expect(result.dirents[0]).toEqual({
    path: '/root/a/b/c/test.txt',
    posInSet: 1,
    setSize: 1,
    depth: 1,
    name: 'a/b/c/test.txt',
    type: 1,
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

  const defaultState = createDefaultState()
  const state = {
    ...defaultState,
    editingValue: 'test.txt',
    focusedIndex: -1,
    root: '/root',
    pathSeparator: '/',
  }

  const result = getNewDirentsAccept(state, 1)

  expect(result.dirents).toEqual(state.items)
  expect(result.newFocusedIndex).toBe(state.focusedIndex)
})
