import { expect, jest, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'

test('handleCopy - with focused dirent', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    cutItems: ['/test.txt'],
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', selected: false, type: DirentType.File, uri: '/test.txt' }],
    pasteShouldMove: true,
  }
  const result = await handleCopy(state)

  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['ClipBoard.writeNativeFiles', 'copy', ['/test.txt']]]))
  expect(result).toEqual({
    ...state,
    cutItems: [],
    pasteShouldMove: false,
  })
})

test('handleCopy - with multiple selected dirents', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'first file ü.txt', selected: true, type: DirentType.File, uri: '/first file ü.txt' },
      { depth: 0, name: 'second.txt', selected: true, type: DirentType.File, uri: '/second.txt' },
      { depth: 0, name: 'third.txt', selected: false, type: DirentType.File, uri: '/third.txt' },
    ],
  }

  await handleCopy(state)

  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'copy', ['/first file ü.txt', '/second.txt']]])
})

test('handleCopy - without focused dirent', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
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
  spy.mockRestore()
})
