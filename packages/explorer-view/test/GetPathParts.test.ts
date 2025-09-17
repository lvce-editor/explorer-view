import { expect, test } from '@jest/globals'
import * as GetPathParts from '../src/parts/GetPathParts/GetPathParts.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test('getPathParts - empty path', () => {
  expect(GetPathParts.getPathParts('', '', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - root path', () => {
  expect(GetPathParts.getPathParts('/', '/', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - single level', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
  ])
})

test('getPathParts - multiple levels', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/subfolder/file.txt', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
    {
      depth: 2,
      path: '/root/folder/subfolder',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
  ])
})

test('getPathParts - path equals root', () => {
  expect(GetPathParts.getPathParts('/root', '/root', PathSeparatorType.Slash)).toEqual([])
})

test('getPathParts - trailing slash', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
  ])
})

test('getPathParts - multiple slashes', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder//subfolder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
    {
      depth: 2,
      path: '/root/folder/',
      pathSeparator: '/',
      root: '/root',
      expanded: true,
    },
  ])
})
