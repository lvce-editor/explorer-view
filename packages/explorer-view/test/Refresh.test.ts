import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { refresh } from '../src/parts/Refresh/Refresh.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'
import { set } from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('refresh - basic', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const result = await refresh(state)
  expect(result).toBeDefined()
  expect(result.items).toBeDefined()
  expect(result.icons).toBeDefined()
  expect(result.maxLineY).toBeDefined()
  expect(result.fileIconCache).toBeDefined()
})

test.skip('refresh - with items', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([
          { name: 'file1', type: 'file' },
          { name: 'file2', type: 'file' },
        ])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const result = await refresh(state)
  expect(result.items.length).toBe(2)
  expect(result.icons.length).toBe(2)
})
