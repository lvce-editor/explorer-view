import { expect, jest, test, beforeEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

const mockListen = jest.fn()

jest.unstable_mockModule('../src/parts/Listen/Listen.ts', () => {
  return {
    listen: mockListen,
  }
})

const Main = await import('../src/parts/Main/Main.ts')

test('main', async () => {
  await Main.main()
  expect(mockListen).toHaveBeenCalled()
})
