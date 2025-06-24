import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleArrowRight } from '../src/parts/HandleArrowRight/HandleArrowRight.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('handleArrowRight - no focused item', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test('handleArrowRight - file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.File, name: 'test.txt', path: '/test.txt', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - directory', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.Directory, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
})

test('handleArrowRight - symlink file', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.SymLinkFile, name: 'test.txt', path: '/test.txt', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).toBe(state)
})

test.skip('handleArrowRight - symlink folder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.SymLinkFolder, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
})

test.skip('handleArrowRight - directory expanded', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.DirectoryExpanded, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
})

test.skip('handleArrowRight - symlink', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.getRealPath') {
        return Promise.resolve('/real/path')
      }
      if (method === 'FileSystem.stat') {
        return Promise.resolve({ isDirectory: () => false })
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: DirentType.Symlink, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  const result = await handleArrowRight(state)
  expect(result).not.toBe(state)
})

test('handleArrowRight - invalid type', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [{ type: 999, name: 'test', path: '/test', depth: 0, selected: false }],
    focusedIndex: 0,
  }
  await expect(handleArrowRight(state)).rejects.toThrow('unsupported file type 999')
})
