import { expect, jest, test } from '@jest/globals'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('openUri calls ParentRpc.invoke with correct parameters', async () => {
  const mock = { invoke: jest.fn() }
  // RendererWorker in source exposes set to replace rpc object; keep that
  RendererWorker.set(mock as any)
  const mockUri = 'file:///test.txt'
  const mockFocus = true
  await openUri(mockUri, mockFocus)
  expect(mock.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})

test('openUri calls ParentRpc.invoke with focus false', async () => {
  const mock = { invoke: jest.fn() }
  RendererWorker.set(mock as any)
  const mockUri = 'file:///test.txt'
  const mockFocus = false
  await openUri(mockUri, mockFocus)
  expect(mock.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})
