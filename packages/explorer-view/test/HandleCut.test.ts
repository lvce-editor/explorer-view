import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('handleCut - with focused dirent', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ name: 'test.txt', type: DirentType.File, path: '/test.txt', depth: 0, selected: false }],
  }
  const result = await handleCut(state)

  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'cut', ['/test.txt'])
  expect(result).toBe(state)
})

test('handleCut - without focused dirent', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const result = await handleCut(state)
  expect(mockRpc.invoke).not.toHaveBeenCalled()
  expect(result).toBe(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[ViewletExplorer/handleCut] no dirent selected')
})