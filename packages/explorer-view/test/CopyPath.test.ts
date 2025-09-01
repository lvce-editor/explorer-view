import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('copyPath - writes absolute path of focused dirent to clipboard', async () => {
  let clipboardText = ''
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string, ...args: any[]): Promise<void> => {
      if (method === 'ClipBoard.writeText') {
        clipboardText = args[0]
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'file.txt', type: DirentType.File, path: '/test/file.txt', depth: 0, selected: false },
    ],
    focusedIndex: 0,
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(clipboardText).toBe('/test/file.txt')
})

test('copyPath - does nothing when no focused dirent', async () => {
  let clipboardCalled = false
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string): Promise<void> => {
      if (method === 'ClipBoard.writeText') {
        clipboardCalled = true
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [],
    focusedIndex: 0,
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(clipboardCalled).toBe(false)
})
