import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { confirmDelete } from '../src/parts/ConfirmDelete/ConfirmDelete.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('confirmDelete - single file', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, message: string) => {
      if (method === 'Confirmprompt.prompt') {
        expect(message).toBe('Are you sure you want to delete "/test/file.txt"?')
        return Promise.resolve(true)
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const result = await confirmDelete(['/test/file.txt'])
  expect(result).toBe(true)
})

test('confirmDelete - multiple files', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, message: string) => {
      if (method === 'Confirmprompt.prompt') {
        expect(message).toBe('Are you sure you want to delete 3 items?')
        return Promise.resolve(false)
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const result = await confirmDelete(['/test/file1.txt', '/test/file2.txt', '/test/file3.txt'])
  expect(result).toBe(false)
})
