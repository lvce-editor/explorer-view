import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { createNestedPath } from '../src/parts/CreateNestedPath/CreateNestedPath.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('createNestedPath - creates all directories', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.mkdir') {
        return Promise.resolve()
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  await createNestedPath('/a/b/c', '/')
})

test('createNestedPath - handles existing directories', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.mkdir') {
        return Promise.reject(new Error('Directory already exists'))
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  await createNestedPath('/a/b/c', '/')
})

test('createNestedPath - propagates other errors', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.mkdir') {
        return Promise.reject(new Error('Permission denied'))
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  await expect(createNestedPath('/a/b/c', '/')).rejects.toThrow('Permission denied')
})
