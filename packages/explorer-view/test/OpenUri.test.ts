import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('openUri calls ParentRpc.invoke with correct parameters', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: jest.fn(),
  })
  RendererWorker.set(mockRpc)
  const mockUri = 'file:///test.txt'
  const mockFocus = true
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})

test('openUri calls ParentRpc.invoke with focus false', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: jest.fn(),
  })
  RendererWorker.set(mockRpc)
  const mockUri = 'file:///test.txt'
  const mockFocus = false
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invoke).toHaveBeenCalledWith('Main.openUri', mockUri, mockFocus)
})
