import { expect, test } from '@jest/globals'
import * as IsTopLevel from '../src/parts/IsTopLevel/IsTopLevel.ts'

test('isTopLevel - depth 1', () => {
  const dirent = {
    depth: 1,
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(false)
})

test('isTopLevel - depth 2', () => {
  const dirent = {
    depth: 2,
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(false)
})
