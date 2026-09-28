import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import { File } from '../src/parts/DirentType/DirentType.ts'
import * as GetPath from '../src/parts/GetPath/GetPath.ts'

test('getPath - file dirent', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'test.txt',
    selected: true,
    type: 1,
    uri: '/test/test.txt',
  }
  expect(GetPath.getPath(dirent)).toBe('/test/test.txt')
})

test('getPath - directory dirent', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'folder',
    selected: false,
    type: 2,
    uri: '/test/folder',
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder')
})

test('getPath - nested path', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'file.js',
    selected: false,
    type: 1,
    uri: '/test/folder/subfolder/file.js',
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder/subfolder/file.js')
})

test('getPath - root path', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: '',
    selected: false,
    type: 2,
    uri: '/',
  }
  expect(GetPath.getPath(dirent)).toBe('/')
})

test('getPath - empty path', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: '',
    selected: false,
    type: 2,
    uri: '',
  }
  expect(GetPath.getPath(dirent)).toBe('')
})

test('getPath - with spaces in path', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'my file.txt',
    selected: true,
    type: 1,
    uri: '/test/my folder/my file.txt',
  }
  expect(GetPath.getPath(dirent)).toBe('/test/my folder/my file.txt')
})

test('getPath - with special characters in path', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'file@test.txt',
    selected: true,
    type: 1,
    uri: '/test/folder#1/file@test.txt',
  }
  expect(GetPath.getPath(dirent)).toBe('/test/folder#1/file@test.txt')
})

test('getPath', () => {
  const item = { depth: 0, name: 'test.txt', selected: false, type: File, uri: '/test.txt' }
  expect(GetPath.getPath(item)).toBe('/test.txt')
})
