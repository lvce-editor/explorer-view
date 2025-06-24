import { expect, jest, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.ts'
import * as RendererWorker from '../src/parts/RendererWorker/RendererWorker.ts'

test('writeText', async () => {
  const mockRpc = MockRpc.create({
    invoke: jest.fn(),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  await ClipBoard.writeText('test text')
  expect(mockRpc.invoke).toHaveBeenCalledTimes(1)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeText', 'test text')
})

test('readNativeFiles', async () => {
  const expectedResult = {
    type: 'copy',
    files: ['/test/file1.txt', '/test/file2.txt'],
  }
  const mockRpc = MockRpc.create({
    invoke: jest.fn().mockReturnValue(expectedResult),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  const result = await ClipBoard.readNativeFiles()
  expect(result).toEqual(expectedResult)
  expect(mockRpc.invoke).toHaveBeenCalledTimes(1)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.readNativeFiles')
})

test('writeNativeFiles', async () => {
  const expectedResult = {
    type: 'copy',
    files: ['/test/file1.txt', '/test/file2.txt'],
  }
  const mockRpc = MockRpc.create({
    invoke: jest.fn().mockReturnValue(expectedResult),
    commandMap: {},
  })
  RendererWorker.set(mockRpc)
  await ClipBoard.writeNativeFiles('copy', ['/test/file.txt'])
  expect(mockRpc.invoke).toHaveBeenCalledTimes(1)
  expect(mockRpc.invoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'copy', ['/test/file.txt'])
})
