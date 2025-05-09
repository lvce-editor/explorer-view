import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import { updateRoot } from '../src/parts/UpdateRoot/UpdateRoot.ts'

test('updateRoot should return same disposed state', async () => {
  const state = createDefaultState()
  // @ts-ignore disposed is used in source but not typed
  state.disposed = true
  const result = await updateRoot(state)
  expect(result).toBe(state)
})

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'FileSystem.readDirWithFileTypes') {
    return [
      { name: 'file1', type: 'file' },
      { name: 'dir1', type: 'directory' },
    ]
  }
  throw new Error(`Unexpected method: ${method}`)
}

test('updateRoot should merge dirents correctly', async () => {
  const state = createDefaultState()

  const mockRpc = MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const result = await updateRoot(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('dir1')
  expect(result.items[1].name).toBe('file1')
})
