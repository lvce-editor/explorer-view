import { test, expect } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleUpload } from '../src/parts/HandleUpload/HandleUpload.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('should upload a file', async () => {
  const written: any[] = []
  const mockRpc = RpcRendererWorker.registerMockRpc({
    'FileSystem.writeFile'(...args: any[]) {
      written.push(args)
    },
  })
  RendererWorker.set(mockRpc)
  const state = createDefaultState()
  const file = { name: 'test.txt', text: (): string => 'hello' }
  const dirents = [{ type: 1, file }]
  await handleUpload(state, dirents)
  expect(written).toHaveLength(1)
  expect(written[0][0]).toContain('test.txt')
  expect(written[0][1]).toBe('hello')
})

test('should do nothing for empty dirents', async () => {
  const mockRpc = RpcRendererWorker.registerMockRpc({})
  RendererWorker.set(mockRpc)
  const state = createDefaultState()
  await handleUpload(state, [])
})
