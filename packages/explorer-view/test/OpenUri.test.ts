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
  expect(mockRpc.invocations).toEqual([['Main.openUri', { focus: mockFocus, uri: mockUri }]])
})

test('openUri calls ParentRpc.invoke with focus false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })
  const mockUri = 'file:///test.txt'
  const mockFocus = false
  await openUri(mockUri, mockFocus)
  expect(mockRpc.invocations).toEqual([['Main.openUri', { focus: mockFocus, uri: mockUri }]])
})

test('openUri opens preview files through the main area input API', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openInput'() {},
  })
  const mockUri = 'file:///test.txt'
  await openUri(mockUri, true, {
    preview: true,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'Main.openInput',
      {
        editorInput: {
          type: 'editor',
          uri: mockUri,
        },
        focus: true,
        preview: true,
      },
    ],
  ])
})

test('openUri opens preview files without moving focus', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openInput'() {},
  })
  const mockUri = 'file:///test.txt'
  await openUri(mockUri, false, {
    preview: true,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'Main.openInput',
      {
        editorInput: {
          type: 'editor',
          uri: mockUri,
        },
        focus: false,
        preview: true,
      },
    ],
  ])
})
