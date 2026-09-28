import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { getDragData } from '../src/parts/GetDragData/GetDragData.js'

test('getDragData - single url', () => {
  const result = getDragData([{ type: DirentType.File, uri: '/a.txt' }])
  expect(result.items[0]).toEqual({ data: 'file:///a.txt', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: 'file:///a.txt', type: 'text/plain' })
  expect(result.label).toBe('a.txt')
})

test('getDragData - multiple urls', () => {
  const result = getDragData([
    { type: DirentType.File, uri: '/a.txt' },
    { type: DirentType.File, uri: '/b.txt' },
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
  const result = getDragData([{ type: DirentType.File, uri: 'memfs:///workspace/Main.elm' }])

  expect(result.items[0]).toEqual({ data: 'memfs:///workspace/Main.elm', type: 'text/uri-list' })
})

test('getDragData - marks remote folders with a trailing slash', () => {
  const result = getDragData([{ type: DirentType.Directory, uri: 'remote-ssh://test-host/workspace/src' }])

  expect(result.items[0]).toEqual({ data: 'remote-ssh://test-host/workspace/src/', type: 'text/uri-list' })
})
