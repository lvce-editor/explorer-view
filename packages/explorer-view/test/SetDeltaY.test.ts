import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
    return 'icon'
  }
  if (method === 'IconTheme.getIcons') {
    return ['icon']
  }
  throw new Error(`Unexpected method: ${method}`)
}

const mockRpc = RendererWorker.registerMockRpc({
  'IconTheme.getFileIcon': invoke.bind(undefined, 'IconTheme.getFileIcon'),
  'IconTheme.getFolderIcon': invoke.bind(undefined, 'IconTheme.getFolderIcon'),
  'IconTheme.getIcons': invoke.bind(undefined, 'IconTheme.getIcons'),
})

test('should not change state when deltaY is the same', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await setDeltaY(state, 0)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('should clamp deltaY to 0 when negative', async () => {
  const state: ExplorerState = createDefaultState()
  const result = await setDeltaY(state, -50)
  expect(result.deltaY).toBe(0)
  expect(result.minLineY).toBe(0)
  expect(mockRpc.invocations).toEqual([])
})

test('should clamp deltaY to max scroll value', async () => {
  const items: ExplorerItem[] = Array.from({ length: 20 }, (_, i) => ({
    name: `file${i}`,
    type: 1,
    path: `/file${i}`,
    depth: 0,
    selected: false,
  }))
  const state: ExplorerState = {
    ...createDefaultState(),
    items,
  }
  const result = await setDeltaY(state, 500)
  expect(result.deltaY).toBe(300)
  expect(result.minLineY).toBe(15)
  expect(mockRpc.invocations).toEqual([
    ['IconTheme.getIcons', []],
  ])
})

test('should update visible items and icons', async () => {
  const items: ExplorerItem[] = Array.from({ length: 20 }, (_, i) => ({
    name: `file${i}`,
    type: 1,
    path: `/file${i}`,
    depth: 0,
    selected: false,
  }))
  const state: ExplorerState = {
    ...createDefaultState(),
    items,
  }
  const result = await setDeltaY(state, 100)
  expect(result.deltaY).toBe(100)
  expect(result.minLineY).toBe(5)
  expect(result.maxLineY).toBe(10)
  expect(mockRpc.invocations).toEqual([
    ['IconTheme.getIcons', []],
  ])
})
