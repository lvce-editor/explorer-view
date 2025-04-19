import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { handleClickSymLink } from '../src/parts/HandleClickSymlink/HandleClickSymlink.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

test('handleClickSymLink - file symlink', async () => {
  const state = createDefaultState()
  const dirent: ExplorerItem = {
    path: '/test/symlink',
    name: 'symlink',
    type: DirentType.Symlink,
    depth: 0,
  }
  const index = 0

  const mockRealPath = '/test/real-file'
  const invoke = jest.fn((method: string): any => {
    if (method === 'FileSystem.getRealPath') {
      return mockRealPath
    }
    if (method === 'FileSystem.stat') {
      return DirentType.File
    }
    if (method === 'Main.openUri') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = await MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  await handleClickSymLink(state, dirent, index)

  expect(invoke).toHaveBeenCalledWith('FileSystem.getRealPath', dirent.path)
  expect(invoke).toHaveBeenCalledWith('FileSystem.stat', mockRealPath)
  expect(invoke).toHaveBeenCalledWith('Main.openUri', dirent.path, true)
})

test('handleClickSymLink - unsupported type', async () => {
  const state = createDefaultState()
  const dirent: ExplorerItem = {
    path: '/test/symlink',
    name: 'symlink',
    type: DirentType.Symlink,
    depth: 0,
  }
  const index = 0

  const mockRealPath = '/test/real-file'
  const invoke = jest.fn((method: string): any => {
    if (method === 'FileSystem.getRealPath') {
      return mockRealPath
    }
    if (method === 'FileSystem.stat') {
      return DirentType.Directory
    }
    throw new Error(`unexpected method ${method}`)
  })

  const mockRpc = await MockRpc.create({
    invoke,
    commandMap: {},
  })
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)

  await expect(handleClickSymLink(state, dirent, index)).rejects.toThrow('unsupported file type')
})
