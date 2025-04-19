import { test, expect, jest } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { copyFilesElectron } from '../src/parts/CopyFilesElectron/CopyFilesElectron.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('copyFilesElectron', async () => {
  const invoke = jest.fn((method: string): any => {
    if (method === 'FileSystem.getPathSeparator') {
      return '/'
    }
    if (method === 'FileSystem.copy') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = await MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  const root = '/test'
  const pathSeparator = '/'
  const fileHandles = [{ name: 'file1.txt' }, { name: 'file2.txt' }] as FileSystemHandle[]
  const files = [] as File[]
  const paths = ['/source/file1.txt', '/source/file2.txt']

  await copyFilesElectron(root, pathSeparator, fileHandles, files, paths)
  // expect(invoke).toHaveBeenCalledWith('FileSystem.getPathSeparator')
  expect(invoke).toHaveBeenCalledWith('FileSystem.copy', '/source/file1.txt', '/test/file1.txt')
  expect(invoke).toHaveBeenCalledWith('FileSystem.copy', '/source/file2.txt', '/test/file2.txt')
})
