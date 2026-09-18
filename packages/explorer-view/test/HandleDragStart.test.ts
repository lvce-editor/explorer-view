import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleDragStart } from '../src/parts/HandleDragStart/HandleDragStart.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

const createItem = (path: string, selected = false): ExplorerItem => ({
  depth: 1,
  name: path,
  path,
  posInSet: 1,
  selected,
  setSize: 1,
  type: DirentType.File,
})

test('starts a native drag with the focused and selected local files', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'ElectronWindow.startDrag': () => {} })
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    items: [createItem('/a.txt', true), createItem('file:///b.txt')],
    platform: PlatformType.Electron,
    pointerDownIndex: 1,
  }
  expect(await handleDragStart(state)).toBe(state)
  expect(rpc.invocations).toEqual([['ElectronWindow.startDrag', ['/a.txt', 'file:///b.txt']]])
})

test('dragging an unselected item excludes the old selection', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'ElectronWindow.startDrag': () => {} })
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [createItem('/a.txt', true), createItem('C:\\workspace\\b.txt')],
    platform: PlatformType.Electron,
    pointerDownIndex: 1,
  }
  await handleDragStart(state)
  expect(rpc.invocations).toEqual([['ElectronWindow.startDrag', ['C:\\workspace\\b.txt']]])
})

test.each([
  { paths: ['/a.txt'], platform: 0 },
  { paths: [], platform: PlatformType.Electron },
  { paths: ['memfs:///a.txt'], platform: PlatformType.Electron },
  { paths: ['/a.txt', 'remote-ssh://host/b.txt'], platform: PlatformType.Electron },
])('keeps HTML dragging for unsupported sources: %j', async ({ paths, platform }) => {
  using rpc = RendererWorker.registerMockRpc({})
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: paths.map((path) => createItem(path, true)),
    platform,
    pointerDownIndex: 0,
  }
  expect(await handleDragStart(state)).toBe(state)
  expect(rpc.invocations).toEqual([])
})
