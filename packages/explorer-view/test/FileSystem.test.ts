import { test, expect, beforeEach } from '@jest/globals'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc = {
  invoke(method: string, ...params: any[]) {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [
          { name: 'file.txt', type: 1 },
          { name: 'folder', type: 2 },
        ]
      case 'FileSystem.writeFile':
        return undefined
      case 'FileSystem.readFile':
        return 'file content'
      case 'FileSystem.remove':
        return undefined
      case 'FileSystem.mkdir':
        return undefined
      case 'FileSystem.rename':
        return undefined
      case 'FileSystem.copy':
        return undefined
      case 'FileSystem.getRealPath':
        return '/real/path'
      case 'FileSystem.getPathSeparator':
        return '/'
      default:
        throw new Error(`unknown method ${method}`)
    }
  },
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
})

test('readDirWithFileTypes', async () => {
  const result = await FileSystem.readDirWithFileTypes('/test')
  expect(result).toEqual([
    { name: 'file.txt', type: 1 },
    { name: 'folder', type: 2 },
  ])
})

test('writeFile', async () => {
  await expect(FileSystem.writeFile('/test/file.txt', 'content')).resolves.toBeUndefined()
})

test('remove', async () => {
  await expect(FileSystem.remove('/test/file.txt')).resolves.toBeUndefined()
})

test('mkdir', async () => {
  await expect(FileSystem.mkdir('/test/newfolder')).resolves.toBeUndefined()
})

test('rename', async () => {
  await expect(FileSystem.rename('/test/old.txt', '/test/new.txt')).resolves.toBeUndefined()
})

test('copy', async () => {
  await expect(FileSystem.copy('/test/source.txt', '/test/dest.txt')).resolves.toBeUndefined()
})

test('getRealPath', async () => {
  const path = await FileSystem.getRealPath('/test/link')
  expect(path).toBe('/real/path')
})
