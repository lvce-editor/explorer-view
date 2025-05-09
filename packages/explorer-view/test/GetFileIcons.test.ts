import { test, expect, beforeEach } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetFileIcons from '../src/parts/GetFileIcons/GetFileIcons.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const handleFileIcons = (...params: readonly any[]) => {
  return params.map((param) => {
    if (param.type === 2) {
      return `folder-icon-${param.name}`
    }
    return `file-icon-${param.name}`
  })
}

const mockRpc = {
  invoke(method: string, ...params: readonly any[]) {
    switch (method) {
      case 'IconTheme.getFileIcon':
        return Promise.resolve('file-icon')
      case 'IconTheme.getFolderIcon':
        return Promise.resolve('folder-icon')
      case 'IconTheme.getIcons': {
        return handleFileIcons(...params)
      }
      default:
        throw new Error(`unexpected method ${method}`)
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
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0, selected: false },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0, selected: false },
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
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0, selected: false },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0, selected: false },
  ]
  const result = await GetFileIcons.getFileIcons(dirents, {})
  expect(result).toEqual({
    icons: ['file-icon', 'folder-icon'],
    newFileIconCache: {
      '/a.txt': 'file-icon',
      '/b': 'folder-icon',
    },
  })
})

test('getFileIcons - mixed cache', async () => {
  const dirents: readonly ExplorerItem[] = [
    { type: DirentType.File, name: 'a.txt', path: '/a.txt', depth: 0, selected: false },
    { type: DirentType.Directory, name: 'b', path: '/b', depth: 0, selected: false },
    { type: DirentType.File, name: 'c.txt', path: '/c.txt', depth: 0, selected: false },
  ]
  const cache: FileIconCache = {
    '/a.txt': 'cached-a',
  }
  const result = await GetFileIcons.getFileIcons(dirents, cache)
  expect(result).toEqual({
    icons: ['cached-a', 'folder-icon', 'file-icon'],
    newFileIconCache: {
      '/a.txt': 'cached-a',
      '/b': 'folder-icon',
      '/c.txt': 'file-icon',
    },
  })
})
