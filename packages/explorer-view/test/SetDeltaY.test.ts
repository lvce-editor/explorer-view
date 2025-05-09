import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'

const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (method === 'IconTheme.getFileIcon' || method === 'IconTheme.getFolderIcon') {
    return 'icon'
  }
  throw new Error(`Unexpected method: ${method}`)
}

const mockRpc = MockRpc.create({
  invoke,
  commandMap: {},
})

RpcRegistry.set(RpcId.RendererWorker, mockRpc)

test('should not change state when deltaY is the same', async () => {
  const state = createDefaultState()
  const result = await setDeltaY(state, 0)
  expect(result).toBe(state)
})

test('should clamp deltaY to 0 when negative', async () => {
  const state = createDefaultState()
  const result = await setDeltaY(state, -50)
  expect(result.deltaY).toBe(0)
  expect(result.minLineY).toBe(0)
})

test('should clamp deltaY to max scroll value', async () => {
  const state = {
    ...createDefaultState(),
    items: Array(20).fill({}),
  }
  const result = await setDeltaY(state, 500)
  expect(result.deltaY).toBe(300)
  expect(result.minLineY).toBe(15)
})

test('should update visible items and icons', async () => {
  const state = {
    ...createDefaultState(),
    items: Array(20).fill({}),
  }
  const result = await setDeltaY(state, 100)
  expect(result.deltaY).toBe(100)
  expect(result.minLineY).toBe(5)
  expect(result.maxLineY).toBe(10)
})
