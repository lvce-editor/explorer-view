import { expect, jest, test } from '@jest/globals'
import { terminate } from '../src/parts/Terminate/Terminate.js'

test('terminate', () => {
  const mockClose = jest.fn()
  globalThis.close = mockClose
  terminate()
  expect(mockClose).toHaveBeenCalled()
})
