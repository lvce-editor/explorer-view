import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'

test('handleCut - with focused dirent', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = await handleCut(state)

  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'cut', ['/test.txt']]])
  expect(result).toEqual({
    ...state,
    pasteShouldMove: true,
    cutItems: ['/test.txt'],
  })
})

test('handleCut - without focused dirent', async () => {
  const mockRpc = RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const result = await handleCut(state)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
