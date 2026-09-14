import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as IsTopLevel from '../src/parts/IsTopLevel/IsTopLevel.ts'

test('isTopLevel - depth 1', () => {
  const dirent: ExplorerItem = {
    depth: 1,
    name: '',
    selected: false,
    type: 0,
    uri: '',
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(true)
})

test('isTopLevel - depth 2', () => {
  const dirent = {
    depth: 2,
    name: '',
    selected: false,
    type: 0,
    uri: '',
  }
  expect(IsTopLevel.isTopLevel(dirent)).toBe(false)
})
