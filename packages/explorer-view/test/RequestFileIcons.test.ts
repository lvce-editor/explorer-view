import type { Rpc } from '@lvce-editor/rpc'
import { test, expect, beforeAll } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RequestFileIcons from '../src/parts/RequestFileIcons/RequestFileIcons.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const handleFileIcons = (requests: readonly any[]): readonly string[] => {
  return requests.map((param) => {
    if (param.type === 2) {
      return `folder-icon`
    }
    return `file-icon`
  })
}

const mockRpc: Rpc = {
  invoke: async (method: string, ...params: readonly any[]) => {
    switch (method) {
      case 'IconTheme.getFileIcon':
        return `file-icon-${params[0].name}`
      case 'IconTheme.getFolderIcon':
        return `folder-icon-${params[0].name}`
      case 'IconTheme.getIcons':
        return handleFileIcons(params[0])
      default:
        throw new Error(`unknown method ${method}`)
    }
  },
  send: () => {},
  invokeAndTransfer: async () => [],
  dispose: async () => {},
}

beforeAll(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
})

test('requestFileIcons - empty requests', async () => {
  const result = await RequestFileIcons.requestFileIcons([])
  expect(result).toEqual([])
})

test('requestFileIcons - file icons', async () => {
  const requests = [{ type: DirentType.File, name: 'file.txt', path: '/test/file.txt' }]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon'])
})

test('requestFileIcons - folder icons', async () => {
  const requests = [{ type: DirentType.Directory, name: 'folder', path: '/test/folder' }]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['folder-icon'])
})

test('requestFileIcons - mixed requests', async () => {
  const requests = [
    { type: DirentType.File, name: 'file.txt', path: '/test/file.txt' },
    { type: DirentType.Directory, name: 'folder', path: '/test/folder' },
  ]
  const result = await RequestFileIcons.requestFileIcons(requests)
  expect(result).toEqual(['file-icon', 'folder-icon'])
})
