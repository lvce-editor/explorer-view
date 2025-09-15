import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.ts'

test('writeText', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'() {},
  })
  await ClipBoard.writeText('test text')
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'test text']])
})

test('readNativeFiles', async () => {
  const expectedResult = {
    type: 'copy',
    files: ['/test/file1.txt', '/test/file2.txt'],
  }
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.readNativeFiles'() {
      return expectedResult
    },
  })
  const result = await ClipBoard.readNativeFiles()
  expect(result).toEqual(expectedResult)
  expect(mockRpc.invocations).toEqual([['ClipBoard.readNativeFiles']])
})

test('writeNativeFiles', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/file.txt'])
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeNativeFiles', 'copy', ['/test/file.txt']]])
})
