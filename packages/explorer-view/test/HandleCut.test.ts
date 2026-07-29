import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'

test('handleCut - with focused dirent', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
    'Focus.setFocus'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focused: false,
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.File }],
  }
  const result = await handleCut(state)

  expect(mockRpc.invocations).toEqual([
    ['ClipBoard.writeNativeFiles', 'cut', ['/test.txt']],
    ['Focus.setFocus', 13],
  ])
  expect(result).toEqual({
    ...state,
    cutItems: ['/test.txt'],
    focus: FocusId.List,
    focused: true,
    pasteShouldMove: true,
  })
})

test('handleCut - without focused dirent', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const result = await handleCut(state)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
