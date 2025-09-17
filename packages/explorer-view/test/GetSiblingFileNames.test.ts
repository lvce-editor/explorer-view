import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as GetSiblingFileNames from '../src/parts/GetSiblingFileNames/GetSiblingFileNames.ts'

test('getSiblingFileNames - root level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      path: '/root/file1.txt',
      name: 'file1.txt',
      depth: 0,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 0,
      setSize: 2,
    },
    {
      path: '/root/file2.txt',
      name: 'file2.txt',
      depth: 0,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 1,
      setSize: 2,
    },
    {
      path: '/root/folder/file3.txt',
      name: 'file3.txt',
      depth: 1,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 0,
      setSize: 1,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt', 'file2.txt'])
})

test('getSiblingFileNames - folder level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      path: '/root/file1.txt',
      name: 'file1.txt',
      depth: 0,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 0,
      setSize: 1,
    },
    {
      path: '/root/folder/file2.txt',
      name: 'file2.txt',
      depth: 1,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 0,
      setSize: 2,
    },
    {
      path: '/root/folder/file3.txt',
      name: 'file3.txt',
      depth: 1,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 1,
      setSize: 2,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 1, '/root', '/')
  expect(result).toEqual(['file2.txt', 'file3.txt'])
})

test('getSiblingFileNames - no siblings', () => {
  const items: readonly ExplorerItem[] = [
    {
      path: '/root/file1.txt',
      name: 'file1.txt',
      depth: 0,
      type: 1,
      icon: '',
      selected: false,
      posInSet: 0,
      setSize: 1,
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt'])
})
