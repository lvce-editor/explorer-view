import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as GetSiblingFileNames from '../src/parts/GetSiblingFileNames/GetSiblingFileNames.ts'

test('getSiblingFileNames - root level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      name: 'file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/root/file1.txt',
    },
    {
      depth: 0,
      name: 'file2.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/root/file2.txt',
    },
    {
      depth: 1,
      name: 'file3.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
      uri: '/root/folder/file3.txt',
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt', 'file2.txt'])
})

test('getSiblingFileNames - folder level files', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      name: 'file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
      uri: '/root/file1.txt',
    },
    {
      depth: 1,
      name: 'file2.txt',
      posInSet: 0,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/root/folder/file2.txt',
    },
    {
      depth: 1,
      name: 'file3.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: 1,
      uri: '/root/folder/file3.txt',
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 1, '/root', '/')
  expect(result).toEqual(['file2.txt', 'file3.txt'])
})

test('getSiblingFileNames - no siblings', () => {
  const items: readonly ExplorerItem[] = [
    {
      depth: 0,
      name: 'file1.txt',
      posInSet: 0,
      selected: false,
      setSize: 1,
      type: 1,
      uri: '/root/file1.txt',
    },
  ]

  const result = GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')
  expect(result).toEqual(['file1.txt'])
})

test.each(['/', '\\'])('getSiblingFileNames - creation only checks the target directory (%s)', (separator) => {
  const item = (name: string, uri: string, depth: number): ExplorerItem => ({
    depth,
    name,
    selected: false,
    type: 7,
    uri: uri.replaceAll('/', () => separator),
  })
  const items = [
    item('editor.devin', '/root/editor.devin', 0),
    item('', '/root/editor.devin', 1),
    item('a.txt', '/root/editor.devin/a.txt', 1),
    item('long-name.txt', '/root/editor.devin/long-name.txt', 1),
    item('install.sh', '/root/install.sh', 0),
    item('nested.txt', '/root/editor.devin/sub/nested.txt', 2),
  ]
  expect(GetSiblingFileNames.getSiblingFileNames(items, 1, '/root', separator)).toEqual(['a.txt', 'long-name.txt'])
})

test('getSiblingFileNames - different length sibling names', () => {
  const items: readonly ExplorerItem[] = [
    { depth: 0, name: 'a', selected: false, type: 7, uri: '/root/a' },
    { depth: 0, name: 'long-name', selected: false, type: 7, uri: '/root/long-name' },
  ]
  expect(GetSiblingFileNames.getSiblingFileNames(items, 0, '/root', '/')).toEqual(['a', 'long-name'])
})
