import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsExpandedDirectory from '../src/parts/IsExpandedDirectory/IsExpandedDirectory.ts'

test('isExpandedDirectory - expanded directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.DirectoryExpanded,
    }),
  ).toBe(true)
})

test('isExpandedDirectory - collapsed directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.Directory,
    }),
  ).toBe(false)
})

test('isExpandedDirectory - expanding directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.DirectoryExpanding,
    }),
  ).toBe(false)
})

test('isExpandedDirectory - file', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.File,
    }),
  ).toBe(false)
})
