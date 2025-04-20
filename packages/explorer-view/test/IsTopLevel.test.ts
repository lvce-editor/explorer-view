import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as IsTopLevel from '../src/parts/IsTopLevel/IsTopLevel.ts'

test('isTopLevel - depth 1', () => {
  const dirent: ExplorerItem = {
    depth: 1,
    name: '',
    path: '',
    type: 0,
    selected: false,
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(true)
})

test('isTopLevel - depth 2', () => {
  const dirent = {
    depth: 2,
    name: '',
    path: '',
    type: 0,
    selected: false,
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(false)
})
