import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'

test('show', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show'() {},
  })
  const x = 100
  const y = 200
  const id = 1
  const args = ['arg1', 'arg2']
  await ContextMenu.show(x, y, id, ...args)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show', x, y, id, ...args]])
})
