import { test, expect, beforeEach } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetFileIcons from '../src/parts/GetFileIcons/GetFileIcons.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc = {
  invoke(method: string, ...params: any[]) {
    switch (method) {
      case 'IconTheme.getFileIcon':
        return `file-${params[0].name}`
      case 'IconTheme.getFolderIcon':
        return `folder-${params[0].name}`
      default:
        throw new Error(`unknown method ${method}`)
    }
  },
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
})

test('getFileIcons - empty dirents', async () => {
  const result = await GetFileIcons.getFileIcons([], {})
  expect(result).toEqual({
    icons: [],
    newFileIconCache: {},
  })
})

test('getFileIcons - all cached', async () => {
  const dirents: readonly ExplorerItem[] = [
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0 },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0 },
  ]
  const cache: FileIconCache = {
    '/a.txt': 'cached-a',
    '/b': 'cached-b',
  }
  const result = await GetFileIcons.getFileIcons(dirents, cache)
  expect(result).toEqual({
    icons: ['cached-a', 'cached-b'],
    newFileIconCache: cache,
  })
})

test('getFileIcons - none cached', async () => {
  const dirents: readonly ExplorerItem[] = [
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0 },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0 },
  ]
  const result = await GetFileIcons.getFileIcons(dirents, {})
  expect(result).toEqual({
    icons: ['file-a.txt', 'folder-b'],
    newFileIconCache: {
      '/a.txt': 'file-a.txt',
      '/b': 'folder-b',
    },
  })
})

test('getFileIcons - mixed cache', async () => {
  const dirents: readonly ExplorerItem[] = [
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0 },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0 },
    { type: DirentType.File, name: 'c.txt', path: '/c.txt', depth: 0 },
  ]
  const cache: FileIconCache = {
    '/a.txt': 'cached-a',
  }
  const result = await GetFileIcons.getFileIcons(dirents, cache)
  expect(result).toEqual({
    icons: ['cached-a', 'folder-b', 'file-c.txt'],
    newFileIconCache: {
      '/a.txt': 'cached-a',
      '/b': 'folder-b',
      '/c.txt': 'file-c.txt',
    },
  })
})
