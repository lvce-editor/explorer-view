import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('handleCopy - with focused dirent', async () => {
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
  const result = await handleCopy(state)

  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'copy', ['/test.txt'])
  expect(result).toBe(state)
})

test('handleCopy - without focused dirent', async () => {
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
  const result = await handleCopy(state)
  expect(mockRpc.invoke).not.toHaveBeenCalled()
  expect(result).toBe(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[ViewletExplorer/handleCopy] no dirent selected')
})
