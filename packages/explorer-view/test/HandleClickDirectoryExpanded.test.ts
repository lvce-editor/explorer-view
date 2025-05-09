import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { set } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleClickDirectoryExpanded } from '../src/parts/HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test.skip('collapse expanded directory', async () => {
  const state = createDefaultState()
  const dirent: ExplorerItem = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})

test('collapse expanded directory with children', async () => {
  const dirent: ExplorerItem = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  }
  const child1: ExplorerItem = {
    name: 'child1',
    type: DirentType.File,
    path: '/test/child1',
    depth: 1,
    selected: false,
  }
  const child2: ExplorerItem = {
    name: 'child2',
    type: DirentType.File,
    path: '/test/child2',
    depth: 1,
    selected: false,
  }
  const state = {
    ...createDefaultState(),
    items: [dirent, child1, child2],
    fileIconCache: {
      '/test/': '',
      '/test/child1': '',
      '/test/child2': '',
    },
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
})

test('collapse expanded directory with many items preserves icons', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const dirent = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  }
  const items = [dirent]
  const fileIconCache: Record<string, string> = { '/test/': 'folder-icon' }

  // Add 10 items with unique icons
  for (let i = 0; i < 10; i++) {
    const child: ExplorerItem = {
      name: `child${i}`,
      type: DirentType.File,
      path: `/test/child${i}`,
      depth: 1,
      selected: false,
    }
    items.push(child)
    fileIconCache[`/test/child${i}`] = `icon-${i}`
  }

  const state = {
    ...createDefaultState(),
    items,
    fileIconCache,
  }
  const index = 0
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(1)
  expect(newState.focusedIndex).toBe(0)
  expect(newState.focused).toBe(true)
  expect(newState.fileIconCache['/test/']).toBe('folder-icon')
})

test('collapse expanded directory with scroll position adjustment', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return Promise.resolve([])
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const otherFolder: ExplorerItem = {
    name: '1',
    type: DirentType.Directory,
    path: '/1',
    depth: 0,
    selected: false,
  }

  const dirent: ExplorerItem = {
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  }
  const items: ExplorerItem[] = [otherFolder, dirent]
  const fileIconCache: Record<string, string> = { '/test/': 'folder-icon' }

  // Add 10 items with unique icons
  for (let i = 0; i < 10; i++) {
    const child: ExplorerItem = {
      name: `child${i}`,
      type: DirentType.File,
      path: `/test/child${i}`,
      depth: 1,
      selected: false,
    }
    items.push(child)
    fileIconCache[`/test/child${i}`] = `icon-${i}`
  }

  const state = {
    ...createDefaultState(),
    items,
    fileIconCache,
    minLineY: 2,
    maxLineY: 7,
    deltaY: 40, // User has scrolled down
    height: 100,
    itemHeight: 20,
  }
  const index = 1
  const keepFocus = true

  const newState = await handleClickDirectoryExpanded(state, dirent, index, keepFocus)

  expect(newState.items).toHaveLength(2)
  expect(newState.focusedIndex).toBe(1)
  expect(newState.focused).toBe(true)
  expect(newState.minLineY).toBe(0)
  expect(newState.maxLineY).toBe(2)
  expect(newState.fileIconCache['/test/']).toBe('folder-icon')
  // After collapsing, since only one item remains and it fits in viewport,
  // scroll position should be reset to 0
  expect(newState.deltaY).toBe(0)
})
