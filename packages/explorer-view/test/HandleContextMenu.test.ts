import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { set, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import { Keyboard } from '../src/parts/MouseEventType/MouseEventType.ts'

test('handleContextMenu - keyboard', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'ContextMenu.show') {
        return
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
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return []
      }
      if (method === 'ContextMenu.show') {
        return
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = createDefaultState()
  const newState = await handleContextMenu(state, 2, 100, 100)
  expect(newState).toBeDefined()
})
