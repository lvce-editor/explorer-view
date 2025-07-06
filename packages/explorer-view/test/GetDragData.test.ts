import { test, expect } from '@jest/globals'
import { getDragData } from '../src/parts/GetDragData/GetDragData.js'

test('getDragData - single url', () => {
  const urls: string[] = ['/a.txt']
  const result = getDragData(urls)
  expect(result).toEqual([
    { type: 'text/uri-list', data: 'file:///a.txt' },
    { type: 'text/plain', data: 'file:///a.txt' },
  ])
  // @ts-ignore
  expect(result.label).toBe('/a.txt')
})

test('getDragData - multiple urls', () => {
  const urls: string[] = ['/a.txt', '/b.txt']
  const result = getDragData(urls)
  expect(result).toEqual([
    { type: 'text/uri-list', data: 'file:///a.txt\nfile:///b.txt' },
    { type: 'text/plain', data: 'file:///a.txt\nfile:///b.txt' },
  ])
  // @ts-ignore
  expect(result.label).toBe('2')
})

test('getDragData - empty', () => {
  const urls: string[] = []
  const result = getDragData(urls)
  expect(result).toEqual([
    { type: 'text/uri-list', data: '' },
    { type: 'text/plain', data: '' },
  ])
  // @ts-ignore
  expect(result.label).toBe('0')
})