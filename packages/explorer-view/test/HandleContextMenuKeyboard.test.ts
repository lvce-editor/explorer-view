import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuKeyboard from '../src/parts/HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'

test('handleContextMenuKeyboard', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    x: 100,
    y: 200,
    minLineY: 0,
    itemHeight: 20,
  }
  const result = await HandleContextMenuKeyboard.handleContextMenuKeyboard(state)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show', 100, 260, 4]])
  expect(result).toBe(state)
})
