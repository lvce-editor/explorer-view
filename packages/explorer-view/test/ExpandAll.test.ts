import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { expandAll } from '../src/parts/ExpandAll/ExpandAll.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'FileSystem.readDirWithFileTypes') {
    return [
      { name: 'file1', type: DirentType.File, path: '/dir1/file1' },
      { name: 'file2', type: DirentType.File, path: '/dir1/file2' },
    ]
  }
  if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
    return ['icon1', 'icon2']
  }
  throw new Error(`Unexpected method: ${method}`)
}

const mockRpc = await MockRpc.create({
  invoke,
  commandMap: {},
})

test('expandAll - no focused item', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const result = await expandAll(state)
  expect(result).toBe(state)
})

test('expandAll - expand directories at same depth', async () => {
  RpcRegistry.set(RendererWorker, mockRpc)
  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      { name: 'dir1', type: DirentType.Directory, depth: 0, path: '/dir1' },
      { name: 'dir2', type: DirentType.Directory, depth: 0, path: '/dir2' },
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
})
