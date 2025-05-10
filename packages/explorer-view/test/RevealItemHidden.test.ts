import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { revealItemHidden } from '../src/parts/RevealItemHidden/RevealItemHidden.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'

test('revealItemHidden - reveals hidden item', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: readonly any[]) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        if (params[0] === '/root') {
          return [{ name: 'folder1', isDirectory: true, type: DirentType.File, path: '/root/folder1' }]
        }
        if (params[0] === '/root/folder1') {
          return [
            { name: 'file1.txt', isDirectory: false, type: DirentType.File, path: '/root/folder1/file1.txt' },
            { name: 'file2.txt', isDirectory: false, type: DirentType.File, path: '/root/folder1/file2.txt' },
          ]
        }
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/root',
  }
  const newState = await revealItemHidden(state, '/root/folder1/file1.txt')
  expect(newState.items.length).toBeGreaterThan(0)
  expect(newState.focused).toBe(true)
  expect(newState.focusedIndex).toBeGreaterThanOrEqual(0)
})

test('revealItemHidden - returns same state for empty path parts', async () => {
  const state = createDefaultState()
  const newState = await revealItemHidden(state, '')
  expect(newState).toEqual(state)
})

test('revealItemHidden - throws error for non-existent file', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state = createDefaultState()
  await expect(revealItemHidden(state, '/non/existent/file.txt')).rejects.toThrow('File not found in explorer')
})
