import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test.skip('handleFocus', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Focus.setFocus'() {},
  })
  const state = createDefaultState()
  const newState = await handleFocus(state)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['Focus.setFocus', WhenExpression.FocusExplorer]]))
  expect(newState).toBe(state)
})
