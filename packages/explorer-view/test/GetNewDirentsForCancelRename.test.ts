import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForCancelRename } from '../src/parts/GetNewDirentsForCancelRename/GetNewDirentsForCancelRename.ts'

test('getNewDirentsForCancelRename - file', () => {
  const items = [
    {
      name: 'test.txt',
      type: DirentType.EditingFile,
      path: '/test.txt',
      depth: 0,
      selected: false,
    },
  ]
  const result = getNewDirentsForCancelRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    name: 'test.txt',
    type: DirentType.File,
    path: '/test.txt',
    depth: 0,
    selected: false,
  })
})

test('getNewDirentsForCancelRename - folder', () => {
  const items = [
    {
      name: 'test',
      type: DirentType.EditingFolder,
      path: '/test',
      depth: 0,
      selected: false,
    },
  ]
  const result = getNewDirentsForCancelRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    name: 'test',
    type: DirentType.Directory,
    path: '/test',
    depth: 0,
    selected: false,
  })
})
