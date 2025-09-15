import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import { Keyboard } from '../src/parts/MouseEventType/MouseEventType.ts'

test('handleContextMenu - keyboard', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'ContextMenu.show'() {
      return
    },
  })

  const state = createDefaultState()
  const newState = await handleContextMenu(state, Keyboard, 0, 0)
  expect(newState).toBeDefined()
  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 0, 20, 4]])
})

test('handleContextMenu - mouse', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'ContextMenu.show'() {
      return
    },
  })

  const state = createDefaultState()
  const newState = await handleContextMenu(state, 2, 100, 100)
  expect(newState).toBeDefined()
  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 100, 4]])
})
