import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { removeDirent } from '../src/parts/RemoveDirent/RemoveDirent.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('removeDirent - removes focused item', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }

  const result = await removeDirent(state)

  expect(result.items).toEqual([{ name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: false }])
  expect(result.focusedIndex).toBe(0)
})

test('removeDirent - removes multiple selected items', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: true },
      { name: 'file3.txt', type: DirentType.File, path: '/file3.txt', depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }

  const result = await removeDirent(state)

  expect(result.items).toEqual([{ name: 'file3.txt', type: DirentType.File, path: '/file3.txt', depth: 0, selected: false }])
  expect(result.focusedIndex).toBe(0)
})

test('removeDirent - removes focused item and selected items', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0, selected: false },
      { name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: true },
      { name: 'file3.txt', type: DirentType.File, path: '/file3.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
  }

  const result = await removeDirent(state)

  expect(result.items).toEqual([])
  expect(result.focusedIndex).toBe(-1)
})

test('removeDirent - handles error when removing files', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.remove') {
        return Promise.reject(new Error('Failed to remove file'))
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file1.txt', type: DirentType.File, path: '/file1.txt', depth: 0, selected: true },
      { name: 'file2.txt', type: DirentType.File, path: '/file2.txt', depth: 0, selected: true },
    ],
    focusedIndex: 0,
  }

  const result = await removeDirent(state)

  expect(result).toBe(state)
})
