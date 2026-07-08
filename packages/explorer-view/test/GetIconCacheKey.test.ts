import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetIconCacheKey from '../src/parts/GetIconCacheKey/GetIconCacheKey.ts'

test('getIconCacheKey - file', () => {
  expect(GetIconCacheKey.getIconCacheKey('/workspace/file.txt', DirentType.File)).toBe('/workspace/file.txt')
})

test('getIconCacheKey - directory', () => {
  expect(GetIconCacheKey.getIconCacheKey('/workspace/folder', DirentType.Directory)).toBe('/workspace/folder')
})

test('getIconCacheKey - expanded directory', () => {
  expect(GetIconCacheKey.getIconCacheKey('/workspace/folder', DirentType.DirectoryExpanded)).toBe('/workspace/folder#expanded')
})
