import { expect, test, beforeEach, jest } from '@jest/globals'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.ts'
import * as RpcId from '../src/parts/RpcId/RpcId.ts'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockInvoke = jest.fn()
const mockRpc = {
  invoke: mockInvoke,
} as any

beforeEach(() => {
  RpcRegistry.set(RpcId.RendererWorker, mockRpc)
  jest.resetAllMocks()
})

test('writeText', async () => {
  await ClipBoard.writeText('test text')
  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('ClipBoard.writeText', 'test text')
})

test('readNativeFiles', async () => {
  const expectedResult = {
    type: 'copy',
    files: ['/test/file1.txt', '/test/file2.txt'],
  }
  // @ts-ignore
  mockInvoke.mockResolvedValue(expectedResult)
  const result = await ClipBoard.readNativeFiles()
  expect(result).toEqual(expectedResult)
  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('ClipBoard.readNativeFiles')
})

test('writeNativeFiles', async () => {
  await ClipBoard.writeNativeFiles('copy', ['/test/file.txt'])
  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('ClipBoard.writeNativeFiles', 'copy', ['/test/file.txt'])
})
