import { test, expect } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleUpload } from '../src/parts/HandleUpload/HandleUpload.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('should upload a file', async () => {
  const written: any[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: any[]) => {
      if (method === 'FileSystem.writeFile') {
        written.push(args)
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
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
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)
  const state = createDefaultState()
  await handleUpload(state, [])
})
