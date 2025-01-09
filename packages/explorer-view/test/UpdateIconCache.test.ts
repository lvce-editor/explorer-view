import { test, expect } from '@jest/globals'
import * as UpdateIconCache from '../src/parts/UpdateIconCache/UpdateIconCache.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { IconRequest } from '../src/parts/IconRequest/IconRequest.ts'
import { FileIconCache } from '../src/parts/FileIconCache/FileIconCache.ts'

test('updateIconCache - empty requests', () => {
  const cache: FileIconCache = {}
  const requests: readonly IconRequest[] = []
  const newIcons: readonly string[] = []
  expect(UpdateIconCache.updateIconCache(cache, requests, newIcons)).toBe(cache)
})

test('updateIconCache - new icons', () => {
  const cache: FileIconCache = {
    '/test/file1.txt': 'icon1',
  }
  const requests: readonly IconRequest[] = [{ type: DirentType.File, name: 'file2.txt', path: '/test/file2.txt' }]
  const newIcons: readonly string[] = ['icon2']
  expect(UpdateIconCache.updateIconCache(cache, requests, newIcons)).toEqual({
    '/test/file1.txt': 'icon1',
    '/test/file2.txt': 'icon2',
  })
})

test('updateIconCache - immutability', () => {
  const cache: FileIconCache = { existing: 'icon' }
  const requests: readonly IconRequest[] = [{ type: DirentType.File, name: 'file.txt', path: '/test/file.txt' }]
  const newIcons: readonly string[] = ['new-icon']
  const result = UpdateIconCache.updateIconCache(cache, requests, newIcons)
  expect(result).not.toBe(cache)
  expect(cache).toEqual({ existing: 'icon' })
})
