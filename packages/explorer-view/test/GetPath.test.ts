import { expect, test } from '@jest/globals'
import * as GetPath from '../src/parts/GetPath/GetPath.ts'

test('getPath - file dirent', () => {
  const dirent = {
    name: 'test.txt',
    path: '/test/test.txt',
    type: 1,
  } as any
  expect(GetPath.getPath(dirent)).toBe('/test/test.txt')
})

test('getPath - directory dirent', () => {
  const dirent = {
    name: 'folder',
    path: '/test/folder',
    type: 2,
  } as any
  expect(GetPath.getPath(dirent)).toBe('/test/folder')
})

test('getPath - nested path', () => {
  const dirent = {
    name: 'file.js',
    path: '/test/folder/subfolder/file.js',
    type: 1,
  } as any
  expect(GetPath.getPath(dirent)).toBe('/test/folder/subfolder/file.js')
})
