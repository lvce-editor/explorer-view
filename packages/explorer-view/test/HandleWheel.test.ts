import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWheel } from '../src/parts/HandleWheel/HandleWheel.ts'

test('handleWheel calls SetDeltaY with correct delta', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 10,
    items: [
      { name: 'test1', type: 1, path: '/test1', depth: 0, selected: false },
      { name: 'test2', type: 1, path: '/test2', depth: 0, selected: false },
      { name: 'test3', type: 1, path: '/test3', depth: 0, selected: false },
      { name: 'test4', type: 1, path: '/test4', depth: 0, selected: false },
      { name: 'test5', type: 1, path: '/test5', depth: 0, selected: false },
    ],
    height: 50,
    itemHeight: 20,
  }
  const result = await handleWheel(state, 0, 5)
  expect(result.deltaY).toBe(15)
  expect(mockRpc.invocations).toEqual([])
})

test('handleWheel with negative delta', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 10,
    items: [
      { name: 'test1', type: 1, path: '/test1', depth: 0, selected: false },
      { name: 'test2', type: 1, path: '/test2', depth: 0, selected: false },
      { name: 'test3', type: 1, path: '/test3', depth: 0, selected: false },
      { name: 'test4', type: 1, path: '/test4', depth: 0, selected: false },
      { name: 'test5', type: 1, path: '/test5', depth: 0, selected: false },
    ],
    height: 50,
    itemHeight: 20,
  }
  const result = await handleWheel(state, 0, -3)
  expect(result.deltaY).toBe(7)
  expect(mockRpc.invocations).toEqual([])
})
