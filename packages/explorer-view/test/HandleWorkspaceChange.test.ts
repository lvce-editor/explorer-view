import { beforeEach, expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc = {
  invoke: jest.fn(),
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('handleWorkspaceChange updates state with new workspace path', async () => {
  mockRpc.invoke.mockImplementation((method: string) => {
    if (method === 'getWorkspacePath') {
      return '/new/path'
    }
    if (method === 'FileSystem.readDirWithFileTypes') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })
  const state = createDefaultState()
  const result = await handleWorkspaceChange(state)
  expect(result.root).toBe('/new/path')
  expect(result).toHaveProperty('root')
  expect(result).toHaveProperty('minLineY')
  expect(result).toHaveProperty('deltaY')
})
