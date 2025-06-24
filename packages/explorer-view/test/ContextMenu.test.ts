import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('show', async () => {
  const mockInvoke = jest.fn()
  const mockRpc = MockRpc.create({
    invoke: mockInvoke,
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  const x = 100
  const y = 200
  const id = 1
  const args = ['arg1', 'arg2']
  await ContextMenu.show(x, y, id, ...args)
  expect(mockRpc.invoke).toHaveBeenCalledTimes(1)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ContextMenu.show', x, y, id, ...args)
})
