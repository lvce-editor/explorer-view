import { expect, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openContainingFolder } from '../src/parts/OpenContainingFolder/OpenContainingFolder.ts'

test('openContainingFolder', async () => {
  const mockRpc = RpcRendererWorker.registerMockRpc({
    'OpenNativeFolder.openNativeFolder'() {},
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: 1, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = await openContainingFolder(mockState)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['OpenNativeFolder.openNativeFolder', '']]))
  expect(result).toBe(mockState)
})
