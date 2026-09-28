import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getNewDirentsForRename } from '../src/parts/GetNewDirentsForRename/GetNewDirentsForRename.ts'

test('getNewDirentsForRename - file', () => {
  const items = [
    {
      depth: 0,
      name: 'test.txt',
      selected: false,
      type: DirentType.File,
      uri: '/test.txt',
    },
  ]
  const result = getNewDirentsForRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test.txt',
    selected: false,
    type: DirentType.EditingFile,
    uri: '/test.txt',
  })
})

test('getNewDirentsForRename - folder', () => {
  const items = [
    {
      depth: 0,
      name: 'test',
      selected: false,
      type: DirentType.Directory,
      uri: '/test',
    },
  ]
  const result = getNewDirentsForRename(items, 0)
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    depth: 0,
    name: 'test',
    selected: false,
    type: DirentType.EditingFolder,
    uri: '/test',
  })
})
