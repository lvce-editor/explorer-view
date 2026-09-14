import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleContextMenuAtIndex } from '../src/parts/HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

test('handleContextMenuAtIndex - clears selection when target is not selected', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a.txt', selected: true, type: DirentType.File, uri: '/a.txt' },
      { depth: 1, name: 'b.txt', selected: true, type: DirentType.File, uri: '/b.txt' },
      { depth: 1, name: 'c.txt', selected: false, type: DirentType.File, uri: '/c.txt' },
    ],
  }

  const result = await handleContextMenuAtIndex(state, 2, 100, 200)

  expect(result.items.map((item) => item.selected)).toEqual([false, false, false])
  expect(result.focusedIndex).toBe(2)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }]])
})

test('handleContextMenuAtIndex - keeps selection when target is selected', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { depth: 1, name: 'a.txt', selected: true, type: DirentType.File, uri: '/a.txt' },
      { depth: 1, name: 'b.txt', selected: true, type: DirentType.File, uri: '/b.txt' },
      { depth: 1, name: 'c.txt', selected: false, type: DirentType.File, uri: '/c.txt' },
    ],
  }

  const result = await handleContextMenuAtIndex(state, 1, 100, 200)

  expect(result.items.map((item) => item.selected)).toEqual([true, true, false])
  expect(result.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }]])
})

test('handleContextMenuAtIndex - keeps selection when target is focused', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 1, name: 'a', selected: false, type: DirentType.Directory, uri: '/a' },
      { depth: 1, name: 'b', selected: true, type: DirentType.Directory, uri: '/b' },
      { depth: 1, name: 'c', selected: false, type: DirentType.Directory, uri: '/c' },
    ],
  }

  const result = await handleContextMenuAtIndex(state, 0, 100, 200)

  expect(result.items.map((item) => item.selected)).toEqual([false, true, false])
  expect(result.focusedIndex).toBe(0)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }]])
})
