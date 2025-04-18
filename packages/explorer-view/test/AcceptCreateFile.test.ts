import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { set } from '@lvce-editor/rpc-registry'
import { acceptCreateFile } from '../src/parts/AcceptCreateFile/AcceptCreateFile.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('acceptCreateFile', async () => {
  const mockRpc = await MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.createFile') {
        return Promise.resolve()
      }
      if (method === 'IconTheme.getFolderIcon') {
        return Promise.resolve('folder-icon')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  set(RendererWorker, mockRpc)

  const state = {
    ...createDefaultState(),
    editingValue: 'test.txt',
    editingIndex: 0,
    items: [
      {
        name: 'test',
        type: 1,
        path: 'test',
        depth: 0,
      },
    ],
  }
  const newState = await acceptCreateFile(state)
  expect(newState.editingIndex).toBe(-1)
  expect(newState.editingType).toBe(0)
})
