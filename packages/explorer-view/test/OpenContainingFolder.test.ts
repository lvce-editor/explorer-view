import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openContainingFolder } from '../src/parts/OpenContainingFolder/OpenContainingFolder.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('openContainingFolder', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: 1, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = await openContainingFolder(mockState)
  expect(mockRpc.invoke).toHaveBeenCalledWith('OpenNativeFolder.openNativeFolder', '')
  expect(result).toBe(mockState)
})
