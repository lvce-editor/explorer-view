import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { copyRelativePath } from '../src/parts/CopyRelativePath/CopyRelativePath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'

test('copyRelativePath - copies relative path of focused dirent', async (): Promise<void> => {
  const state: ExplorerState = createDefaultState()
  const mockState: ExplorerState = {
    ...state,
    // @ts-ignore
    focusedDirent: {
      path: '/test/file.txt',
      name: 'file.txt',
      type: 'file',
    },
  }
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await copyRelativePath(mockState)
  expect(mockRpc.invocations).toEqual([])
})

test('copyRelativePath - returns state when no focused dirent', async (): Promise<void> => {
  const state = createDefaultState()
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  const result = await copyRelativePath(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})
