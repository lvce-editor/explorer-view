import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsExpandedDirectory from '../src/parts/IsExpandedDirectory/IsExpandedDirectory.ts'

test('isExpandedDirectory - expanded directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.DirectoryExpanded,
    } as any),
  ).toBe(true)
})

test('isExpandedDirectory - collapsed directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.Directory,
    } as any),
  ).toBe(false)
})

test('isExpandedDirectory - expanding directory', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.DirectoryExpanding,
    } as any),
  ).toBe(false)
})

test('isExpandedDirectory - file', () => {
  expect(
    IsExpandedDirectory.isExpandedDirectory({
      type: DirentType.File,
    } as any),
  ).toBe(false)
})
