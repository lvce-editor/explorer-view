import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as RpcRegistry from '@lvce-editor/rpc-registry'
import { Directory, DirectoryExpanded } from '../src/parts/DirentType/DirentType.ts'
import { refreshChildDirents } from '../src/parts/RefreshChildDirents/RefreshChildDirents.ts'
import { RendererWorker } from '../src/parts/RpcId/RpcId.ts'

test('refreshChildDirents - basic', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        return [
          { name: 'file1.txt', type: 'file' },
          { name: 'folder1', type: 'directory' },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const folder = { type: Directory, name: 'test', path: '/test', depth: 0, selected: false }
  const result = await refreshChildDirents(folder, '/', [])
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('file1.txt')
  expect(result[0].path).toBe('/test/file1.txt')
  expect(result[0].depth).toBe(1)
  expect(result[1].name).toBe('folder1')
  expect(result[1].path).toBe('/test/folder1')
  expect(result[1].depth).toBe(1)
})

test('refreshChildDirents - with expanded folder', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, path?: string) => {
      if (method === 'FileSystem.readDirWithFileTypes') {
        if (path === '/test') {
          return [{ name: 'folder1', type: 'directory' }]
        }
        if (path === '/test/folder1') {
          return [{ name: 'file1.txt', type: 'file' }]
        }
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RpcRegistry.set(RendererWorker, mockRpc)

  const folder = { type: Directory, name: 'test', path: '/test', depth: 0, selected: false }
  const result = await refreshChildDirents(folder, '/', ['/test/folder1'])
  expect(result).toHaveLength(2)
  expect(result[0].name).toBe('folder1')
  expect(result[0].path).toBe('/test/folder1')
  expect(result[0].type).toBe(DirectoryExpanded)
  expect(result[0].depth).toBe(1)
  expect(result[1].name).toBe('file1.txt')
  expect(result[1].path).toBe('/test/folder1/file1.txt')
  expect(result[1].depth).toBe(2)
})
