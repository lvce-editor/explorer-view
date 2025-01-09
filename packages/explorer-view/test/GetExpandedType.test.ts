import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetExpandedType from '../src/parts/GetExpandedType/GetExpandedType.ts'

test('getExpandedType - directory', () => {
  expect(GetExpandedType.getExpandedType(DirentType.Directory)).toBe(DirentType.DirectoryExpanded)
})

test('getExpandedType - file', () => {
  expect(() => GetExpandedType.getExpandedType(DirentType.File)).toThrow('cannot expand file')
})

test('getExpandedType - symlink file', () => {
  expect(() => GetExpandedType.getExpandedType(DirentType.SymLinkFile)).toThrow('cannot expand symlink file')
})

test('getExpandedType - already expanded directory', () => {
  expect(() => GetExpandedType.getExpandedType(DirentType.DirectoryExpanded)).toThrow('directory already expanded')
})

test('getExpandedType - expanding directory', () => {
  expect(() => GetExpandedType.getExpandedType(DirentType.DirectoryExpanding)).toThrow('directory is expanding')
})

test('getExpandedType - unknown type', () => {
  expect(() => GetExpandedType.getExpandedType(999999)).toThrow('unsupported dirent type')
})
