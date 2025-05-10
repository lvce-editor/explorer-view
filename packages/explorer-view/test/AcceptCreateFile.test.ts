import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { set } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptCreateFile } from '../src/parts/AcceptCreateFile/AcceptCreateFile.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('acceptCreateFile', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...params: readonly any[]) => {
      if (method === 'FileSystem.createFile') {
        return
      }
      if (method === 'FileSystem.writeFile') {
        return
      }
      if (method === 'IconTheme.getFolderIcon') {
        return 'folder-icon'
      }
      if (method === 'IconTheme.getIcons') {
        return ['folder-icon']
      }
      if (method === 'FileSystem.readDirWithFileTypes') {
        const path = params[0]
        if (path === '/test') {
          return [{ name: 'folder1', type: DirentType.Directory }]
        }
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

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
})
