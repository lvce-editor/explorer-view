import { test, expect } from '@jest/globals'
import { getDragData } from '../src/parts/GetDragData/GetDragData.js'

test('getDragData - single url', () => {
  const urls: string[] = ['/a.txt']
  const result = getDragData(urls)
  expect(result[0]).toEqual({ type: 'text/uri-list', data: 'file:///a.txt' })
  expect(result[1]).toEqual({ type: 'text/plain', data: 'file:///a.txt' })
  expect((result as any).label).toBe('a.txt')
})

test('getDragData - multiple urls', () => {
  const urls: string[] = ['/a.txt', '/b.txt']
  const result = getDragData(urls)
  expect(result[0]).toEqual({ type: 'text/uri-list', data: 'file:///a.txt\nfile:///b.txt' })
  expect(result[1]).toEqual({ type: 'text/plain', data: 'file:///a.txt\nfile:///b.txt' })
  expect((result as any).label).toBe('2')
})

test('getDragData - empty', () => {
  const urls: string[] = []
  const result = getDragData(urls)
  expect(result[0]).toEqual({ type: 'text/uri-list', data: '' })
  expect(result[1]).toEqual({ type: 'text/plain', data: '' })
  expect((result as any).label).toBe('0')
})
