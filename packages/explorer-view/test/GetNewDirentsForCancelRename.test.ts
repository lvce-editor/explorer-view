import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForCancelRename } from '../src/parts/GetNewDirentsForCancelRename/GetNewDirentsForCancelRename.ts'

test('getNewDirentsForCancelRename - file', () => {
  const items = [
    {
      depth: 0,
      name: 'test.txt',
      selected: false,
      type: DirentType.EditingFile,
      uri: '/test.txt',
    },
  ]
  const result = getNewDirentsForCancelRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test.txt',
    selected: false,
    type: DirentType.File,
    uri: '/test.txt',
  })
})

test('getNewDirentsForCancelRename - folder', () => {
  const items = [
    {
      depth: 0,
      name: 'test',
      selected: false,
      type: DirentType.EditingFolder,
      uri: '/test',
    },
  ]
  const result = getNewDirentsForCancelRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test',
    selected: false,
    type: DirentType.Directory,
    uri: '/test',
  })
})
