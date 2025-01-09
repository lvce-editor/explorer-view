import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('@lvce-editor/rpc', () => {
  return {
    WebWorkerRpcClient: {
      create: jest.fn(() => {
        return {
          dispose: jest.fn(),
        }
      }),
    },
  }
})

const Listen = await import('../src/parts/Listen/Listen.ts')
const rpc = await import('@lvce-editor/rpc')

beforeEach(() => {
  jest.resetAllMocks()
})

test('listen', async () => {
  await Listen.listen()
  expect(rpc.WebWorkerRpcClient.create).toHaveBeenCalledTimes(1)
  expect(rpc.WebWorkerRpcClient.create).toHaveBeenCalledWith({
    commandMap: expect.any(Object),
  })
})
