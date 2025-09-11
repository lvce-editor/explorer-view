import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { expandAll } from '../src/parts/ExpandAll/ExpandAll.ts'

const mockRpc = RendererWorker.registerMockRpc({
  'FileSystem.readDirWithFileTypes'() {
    return [
      { name: 'file1', type: DirentType.File, path: '/dir1/file1' },
      { name: 'file2', type: DirentType.File, path: '/dir1/file2' },
    ]
  },
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

test('expandAll - no focused item', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const result = await expandAll(state)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('expandAll - expand directories at same depth', async () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'dir1', type: DirentType.Directory, depth: 0, path: '/dir1', selected: false },
      { name: 'dir2', type: DirentType.Directory, depth: 0, path: '/dir2', selected: false },
    ],
    focusedIndex: 0,
  }

  const result = await expandAll(state)

  expect(result.items).toHaveLength(6)
  expect(result.items[0].type).toBe(DirentType.DirectoryExpanded)
  expect(result.items[1].type).toBe(DirentType.File)
  expect(result.items[2].name).toBe('file2')
  expect(result.items[3].name).toBe('dir2')
  expect(result.icons).toHaveLength(6)
  expect(result.fileIconCache).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/dir1'],
    ['FileSystem.readDirWithFileTypes', '/dir2'],
    [
      'IconTheme.getIcons',
      [
        { name: 'dir1', type: 2 },
        { name: 'file1', type: 1 },
        { name: 'file2', type: 1 },
        { name: 'dir2', type: 2 },
        { name: 'file1', type: 1 },
        { name: 'file2', type: 1 },
      ],
    ],
  ])
})
