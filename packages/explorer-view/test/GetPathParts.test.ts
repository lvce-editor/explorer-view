import { expect, test } from '@jest/globals'
import * as GetPathParts from '../src/parts/GetPathParts/GetPathParts.ts'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.ts'

test.skip('getPathParts - empty path', () => {
  expect(GetPathParts.getPathParts('', '', PathSeparatorType.Slash)).toEqual([])
})

test.skip('getPathParts - root path', () => {
  expect(GetPathParts.getPathParts('/', '/', PathSeparatorType.Slash)).toEqual([])
})

test.skip('getPathParts - single level', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test.skip('getPathParts - multiple levels', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/subfolder/file.txt', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 2,
      path: '/root/folder/subfolder',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test.skip('getPathParts - path equals root', () => {
  expect(GetPathParts.getPathParts('/root', '/root', PathSeparatorType.Slash)).toEqual([])
})

test.skip('getPathParts - trailing slash', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder/', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})

test.skip('getPathParts - multiple slashes', () => {
  expect(GetPathParts.getPathParts('/root', '/root/folder//subfolder', PathSeparatorType.Slash)).toEqual([
    {
      depth: 0,
      path: '/root',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 1,
      path: '/root/folder',
      pathSeparator: '/',
      root: '/root',
    },
    {
      depth: 2,
      path: '/root/folder/',
      pathSeparator: '/',
      root: '/root',
    },
  ])
})
