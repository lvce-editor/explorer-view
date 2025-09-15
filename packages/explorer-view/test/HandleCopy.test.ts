import { expect, jest, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'

test('handleCopy - with focused dirent', async () => {
  const mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = await handleCopy(state)

  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['ClipBoard.writeNativeFiles', 'copy', ['/test.txt']]]))
  expect(result).toEqual({
    ...state,
    pasteShouldMove: false,
  })
})

test('handleCopy - without focused dirent', async () => {
  const mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const result = await handleCopy(state)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[ViewletExplorer/handleCopy] no dirent selected')
})
