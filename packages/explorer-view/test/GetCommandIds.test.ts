import { test, expect } from '@jest/globals'
import { getCommandIds } from '../src/parts/GetCommandIds/GetCommandIds.ts'

test('should return command ids array', () => {
  const ids = getCommandIds()
  expect(Array.isArray(ids)).toBe(true)
})
