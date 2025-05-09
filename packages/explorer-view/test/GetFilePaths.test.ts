import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { getFilePaths } from '../src/parts/GetFilePaths/GetFilePaths.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('getFilePaths - non-electron platform', async () => {
  const files = [new File([], 'test.txt')]
  const paths = await getFilePaths(files, PlatformType.Web)
  expect(paths).toEqual([''])
})

test('getFilePaths - electron platform', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystemHandle.getFilePathElectron') {
        return Promise.resolve('/path/to/file')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const files = [new File([], 'test.txt')]
  const paths = await getFilePaths(files, PlatformType.Electron)
  expect(paths).toEqual(['/path/to/file'])
})

test('getFilePaths - multiple files', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystemHandle.getFilePathElectron') {
        return Promise.resolve('/path/to/file')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const files = [new File([], 'test1.txt'), new File([], 'test2.txt')]
  const paths = await getFilePaths(files, PlatformType.Electron)
  expect(paths).toEqual(['/path/to/file', '/path/to/file'])
})
