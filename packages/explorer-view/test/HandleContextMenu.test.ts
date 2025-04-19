import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { set } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import { Keyboard } from '../src/parts/MouseEventType/MouseEventType.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('handleContextMenu - keyboard', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'ContextMenu.show') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const newState = await handleContextMenu(state, Keyboard, 0, 0)
  expect(newState).toBeDefined()
})

test('handleContextMenu - mouse', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      if (method === 'ContextMenu.show') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const newState = await handleContextMenu(state, 2, 100, 100)
  expect(newState).toBeDefined()
})
