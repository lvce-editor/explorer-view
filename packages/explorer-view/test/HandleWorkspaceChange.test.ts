import { test, expect, jest } from '@jest/globals'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc = {
  invoke: jest.fn(),
} as any

test('handleWorkspaceChange updates state with new workspace path', async () => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  const state = createDefaultState()
  const result = await handleWorkspaceChange(state)
  expect(result.root).not.toBe(state.root)
  expect(result).toHaveProperty('root')
  expect(result).toHaveProperty('minLineY')
  expect(result).toHaveProperty('deltaY')
})
