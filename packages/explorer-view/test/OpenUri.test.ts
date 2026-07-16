import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

test('openUri calls ParentRpc.invoke with correct parameters', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })
  const mockUri = 'file:///test.txt'
  const mockFocus = true
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invocations).toEqual([['Main.openUri', mockUri, mockFocus]])
})

test('openUri calls ParentRpc.invoke with focus false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })
  const mockUri = 'file:///test.txt'
  const mockFocus = false
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invocations).toEqual([['Main.openUri', mockUri, mockFocus]])
})

test('openUri passes preview options to the main area', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })
  const mockUri = 'file:///test.txt'
  await openUri(mockUri, true, {
    preview: true,
  })
  expect(mockRpc.invocations).toEqual([['Main.openUri', mockUri, true, { preview: true }]])
})
