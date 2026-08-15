import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { getDragData } from '../src/parts/GetDragData/GetDragData.js'

test('getDragData - single url', () => {
  const result = getDragData([{ path: '/a.txt', type: DirentType.File }])
  expect(result.items[0]).toEqual({ data: 'file:///a.txt', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: 'file:///a.txt', type: 'text/plain' })
  expect(result.label).toBe('a.txt')
})

test('getDragData - multiple urls', () => {
  const result = getDragData([
    { path: '/a.txt', type: DirentType.File },
    { path: '/b.txt', type: DirentType.File },
  ])
  expect(result.items[0]).toEqual({ data: 'file:///a.txt\nfile:///b.txt', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: 'file:///a.txt\nfile:///b.txt', type: 'text/plain' })
  expect(result.label).toBe('2')
})

test('getDragData - empty', () => {
  const result = getDragData([])
  expect(result.items[0]).toEqual({ data: '', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: '', type: 'text/plain' })
  expect(result.label).toBe('0')
})

test('getDragData - preserves non-file workspace uri', () => {
  const result = getDragData([{ path: 'memfs:///workspace/Main.elm', type: DirentType.File }])

  expect(result.items[0]).toEqual({ data: 'memfs:///workspace/Main.elm', type: 'text/uri-list' })
})

test('getDragData - marks remote folders with a trailing slash', () => {
  const result = getDragData([{ path: 'remote-ssh://test-host/workspace/src', type: DirentType.Directory }])

  expect(result.items[0]).toEqual({ data: 'remote-ssh://test-host/workspace/src/', type: 'text/uri-list' })
})
