import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getFileOperationsCopy } from '../src/parts/GetFileOperationsCopy/GetFileOperationsCopy.ts'

test('getFileOperationsCopy - no conflicts', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [{ name: 'existing.txt', type: 1, path: '/test/existing.txt', depth: 0, selected: false }]
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/file.txt', path: '/test/file.txt' }])
})

test('getFileOperationsCopy - single conflict', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [{ name: 'file.txt', type: 1, path: '/test/file.txt', depth: 0, selected: false }]
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/file.txt', path: '/test/file copy.txt' }])
})

test('getFileOperationsCopy - multiple conflicts', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [
    { name: 'file.txt', type: 1, path: '/test/file.txt', depth: 0, selected: false },
    { name: 'file copy.txt', type: 1, path: '/test/file copy.txt', depth: 0, selected: false },
  ]
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/file.txt', path: '/test/file copy 1.txt' }])
})

test('getFileOperationsCopy - multiple numbered conflicts', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [
    { name: 'file.txt', type: 1, path: '/test/file.txt', depth: 0, selected: false },
    { name: 'file copy.txt', type: 1, path: '/test/file copy.txt', depth: 0, selected: false },
    { name: 'file copy 1.txt', type: 1, path: '/test/file copy 1.txt', depth: 0, selected: false },
    { name: 'file copy 2.txt', type: 1, path: '/test/file copy 2.txt', depth: 0, selected: false },
  ]
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/file.txt', path: '/test/file copy 3.txt' }])
})

test('getFileOperationsCopy - file without extension', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [{ name: 'README', type: 1, path: '/test/README', depth: 0, selected: false }]
  const files = ['/source/README']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/README', path: '/test/README copy' }])
})

test('getFileOperationsCopy - file without extension multiple conflicts', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [
    { name: 'README', type: 1, path: '/test/README', depth: 0, selected: false },
    { name: 'README copy', type: 1, path: '/test/README copy', depth: 0, selected: false },
    { name: 'README copy 1', type: 1, path: '/test/README copy 1', depth: 0, selected: false },
  ]
  const files = ['/source/README']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/README', path: '/test/README copy 2' }])
})

test('getFileOperationsCopy - multiple files with conflicts', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [
    { name: 'file1.txt', type: 1, path: '/test/file1.txt', depth: 0, selected: false },
    { name: 'file2.txt', type: 1, path: '/test/file2.txt', depth: 0, selected: false },
  ]
  const files = ['/source/file1.txt', '/source/file2.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([
    { type: FileOperationType.Copy, from: '/source/file1.txt', path: '/test/file1 copy.txt' },
    { type: FileOperationType.Copy, from: '/source/file2.txt', path: '/test/file2 copy.txt' },
  ])
})

test('getFileOperationsCopy - empty dirents', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = []
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([{ type: FileOperationType.Copy, from: '/source/file.txt', path: '/test/file.txt' }])
})

test('getFileOperationsCopy - empty files', () => {
  const root = '/test'
  const dirents: readonly ExplorerItem[] = [{ name: 'existing.txt', type: 1, path: '/test/existing.txt', depth: 0, selected: false }]
  const files: readonly string[] = []

  const result = getFileOperationsCopy(root, dirents, files)
  expect(result).toEqual([])
})
