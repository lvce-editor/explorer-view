import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuMouseAt from '../src/parts/HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'

test('handleContextMenuMouseAt', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    uid: 1,
    focusedIndex: 0,
    x: 0,
    y: 0,
    minLineY: 0,
    itemHeight: 20,
  }
  const result = await HandleContextMenuMouseAt.handleContextMenuMouseAt(state, 100, 200)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 200, 4]])
  expect(result).toEqual({ ...state, focused: false, focusedIndex: -1 })
})
