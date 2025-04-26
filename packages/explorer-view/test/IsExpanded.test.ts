import { test, expect } from '@jest/globals'
import { Directory, DirectoryExpanded, DirectoryExpanding, File } from '../src/parts/DirentType/DirentType.ts'
import { isExpanded } from '../src/parts/IsExpanded/IsExpanded.ts'

test('isExpanded - DirectoryExpanded', () => {
  const item = { type: DirectoryExpanded, name: 'test', path: '/test', depth: 0, selected: false }
  expect(isExpanded(item)).toBe(true)
})

test('isExpanded - DirectoryExpanding', () => {
  const item = { type: DirectoryExpanding, name: 'test', path: '/test', depth: 0, selected: false }
  expect(isExpanded(item)).toBe(true)
})

test('isExpanded - Directory', () => {
  const item = { type: Directory, name: 'test', path: '/test', depth: 0, selected: false }
  expect(isExpanded(item)).toBe(false)
})

test('isExpanded - File', () => {
  const item = { type: File, name: 'test', path: '/test', depth: 0, selected: false }
  expect(isExpanded(item)).toBe(false)
})
