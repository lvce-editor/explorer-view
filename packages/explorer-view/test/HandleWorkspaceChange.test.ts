import { beforeEach, expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import { MockRpc } from '@lvce-editor/rpc'

const invoke = (method: string): any => {
  if (method === 'Workspace.getPath') {
    return '/new/path'
  }
  if (method === 'FileSystem.readDirWithFileTypes') {
    return []
  }
  if (method === 'FileSystem.getPathSeparator') {
    return '/'
  }
  if (method === 'Preferences.get') {
    return false
  }
  throw new Error(`unexpected method ${method}`)
}

const mockRpc = await MockRpc.create({
  invoke,
  commandMap: {},
})

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('handleWorkspaceChange updates state with new workspace path', async () => {
  const state = createDefaultState()
  const result = await handleWorkspaceChange(state)
  expect(result.root).toBe('/new/path')
  expect(result).toHaveProperty('root')
  expect(result).toHaveProperty('minLineY')
  expect(result).toHaveProperty('deltaY')
})
