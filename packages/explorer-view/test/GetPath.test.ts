import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as GetPath from '../src/parts/GetPath/GetPath.ts'

test('getPath - file dirent', () => {
  const dirent: ExplorerItem = {
    name: 'test.txt',
    path: '/test/test.txt',
    type: 1,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/test/test.txt')
})

test('getPath - directory dirent', () => {
  const dirent: ExplorerItem = {
    name: 'folder',
    path: '/test/folder',
    type: 2,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder')
})

test('getPath - nested path', () => {
  const dirent: ExplorerItem = {
    name: 'file.js',
    path: '/test/folder/subfolder/file.js',
    type: 1,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder/subfolder/file.js')
})

test('getPath - root path', () => {
  const dirent: ExplorerItem = {
    name: '',
    path: '/',
    type: 2,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/')
})

test('getPath - empty path', () => {
  const dirent: ExplorerItem = {
    name: '',
    path: '',
    type: 2,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('')
})

test('getPath - with spaces in path', () => {
  const dirent: ExplorerItem = {
    name: 'my file.txt',
    path: '/test/my folder/my file.txt',
    type: 1,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/test/my folder/my file.txt')
})

test('getPath - with special characters in path', () => {
  const dirent: ExplorerItem = {
    name: 'file@test.txt',
    path: '/test/folder#1/file@test.txt',
    type: 1,
    depth: 0,
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder#1/file@test.txt')
})
