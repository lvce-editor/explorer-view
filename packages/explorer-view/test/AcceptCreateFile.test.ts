import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreateFile } from '../src/parts/AcceptCreateFile/AcceptCreateFile.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('acceptCreateFile', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.createFile'() {},
    'FileSystem.writeFile'() {},
    'IconTheme.getFolderIcon'() {
      return 'folder-icon'
    },
    'IconTheme.getIcons'() {
      return ['folder-icon']
    },
    'FileSystem.readDirWithFileTypes'(...params: any[]) {
      const path = params[0]
      if (path === '/test') {
        return [{ name: 'folder1', type: DirentType.Directory }]
      }
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/test',
    editingValue: 'test.txt',
    editingIndex: 0,
    items: [
      {
        name: 'test',
        type: 1,
        path: 'test',
        depth: 0,
        selected: false,
      },
    ],
  }
  const newState = await acceptCreateFile(state)
  expect(newState.editingIndex).toBe(-1)
  expect(newState.editingType).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', 'test/test.txt', '']])
})
