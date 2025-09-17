import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as UpdateIcons from '../src/parts/UpdateIcons/UpdateIcons.ts'

test('updateIcons - should update icons for visible items', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const defaultState: ExplorerState = CreateDefaultState.createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    items: [
      { name: 'file1.ts', type: 1, path: '/test/file1.ts', depth: 1, selected: false },
      { name: 'file2.ts', type: 1, path: '/test/file2.ts', depth: 1, selected: false },
      { name: 'file3.ts', type: 1, path: '/test/file3.ts', depth: 1, selected: false },
    ],
    minLineY: 0,
    maxLineY: 2,
  }

  const result = await UpdateIcons.updateIcons(state)

  expect(result.icons).toHaveLength(2)
  expect(result.fileIconCache).toBeDefined()
  expect(result.items).toEqual(state.items)
  expect(result.minLineY).toBe(state.minLineY)
  expect(result.maxLineY).toBe(state.maxLineY)
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'file1.ts', type: 1 },
        { name: 'file2.ts', type: 1 },
      ],
    ],
  ])
})

test('updateIcons - should handle empty visible items', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const defaultState: ExplorerState = CreateDefaultState.createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    items: [],
    minLineY: 0,
    maxLineY: 0,
  }

  const result = await UpdateIcons.updateIcons(state)

  expect(result.icons).toHaveLength(0)
  expect(result.fileIconCache).toBeDefined()
  expect(result.items).toEqual(state.items)
  expect(mockRpc.invocations).toEqual([])
})
