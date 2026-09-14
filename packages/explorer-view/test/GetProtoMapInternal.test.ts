import { test, expect } from '@jest/globals'
import type { RawDirent } from '../src/parts/RawDirent/RawDirent.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getProtoMapInternal } from '../src/parts/GetProtoMapInternal/GetProtoMapInternal.ts'

test('getProtoMapInternal - empty directory', () => {
  const root = '/root'
  const pathToDirents = {
    '/root': [],
  }
  const expandedPaths: string[] = []
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([])
})

test('getProtoMapInternal - directory with files', () => {
  const root = '/root'
  const pathToDirents: Record<string, readonly RawDirent[]> = {
    '/root': [
      { name: 'file1.txt', type: DirentType.File },
      { name: 'file2.txt', type: DirentType.File },
    ],
  }
  const expandedPaths: string[] = []
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      depth: 1,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.File,
      uri: '/root/file1.txt',
    },
    {
      depth: 1,
      name: 'file2.txt',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.File,
      uri: '/root/file2.txt',
    },
  ])
})

test('getProtoMapInternal - directory with subdirectories', () => {
  const root = '/root'
  const pathToDirents: Record<string, readonly RawDirent[]> = {
    '/root': [
      { name: 'folder1', type: DirentType.Directory },
      { name: 'folder2', type: DirentType.Directory },
    ],
    '/root/folder1': [{ name: 'file1.txt', type: DirentType.File }],
    '/root/folder2': [{ name: 'file2.txt', type: DirentType.File }],
  }
  const expandedPaths: string[] = ['/root/folder1']
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      depth: 1,
      name: 'folder1',
      posInSet: 1,
      selected: false,
      setSize: 2,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder1',
    },
    {
      depth: 2,
      name: 'file1.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/root/folder1/file1.txt',
    },
    {
      depth: 1,
      name: 'folder2',
      posInSet: 2,
      selected: false,
      setSize: 2,
      type: DirentType.Directory,
      uri: '/root/folder2',
    },
    {
      depth: 2,
      name: 'file2.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: 7,
      uri: '/root/folder2/file2.txt',
    },
  ])
})

test('getProtoMapInternal - directory with different file types', () => {
  const root = '/root'
  const pathToDirents: Record<string, readonly RawDirent[]> = {
    '/root': [
      { name: 'file.txt', type: DirentType.File },
      { name: 'symlink.txt', type: DirentType.SymLinkFile },
      { name: 'folder', type: DirentType.Directory },
      { name: 'symlink-folder', type: DirentType.SymLinkFolder },
    ],
  }
  const expandedPaths: string[] = []
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      depth: 1,
      name: 'file.txt',
      posInSet: 1,
      selected: false,
      setSize: 4,
      type: DirentType.File,
      uri: '/root/file.txt',
    },
    {
      depth: 1,
      name: 'symlink.txt',
      posInSet: 2,
      selected: false,
      setSize: 4,
      type: DirentType.SymLinkFile,
      uri: '/root/symlink.txt',
    },
    {
      depth: 1,
      name: 'folder',
      posInSet: 3,
      selected: false,
      setSize: 4,
      type: DirentType.Directory,
      uri: '/root/folder',
    },
    {
      depth: 1,
      name: 'symlink-folder',
      posInSet: 4,
      selected: false,
      setSize: 4,
      type: DirentType.SymLinkFolder,
      uri: '/root/symlink-folder',
    },
  ])
})

test('getProtoMapInternal - non-existent directory', () => {
  const root = '/root'
  const pathToDirents = {}
  const expandedPaths: string[] = []
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([])
})

test('getProtoMapInternal - nested directory structure', () => {
  const root = '/root'
  const pathToDirents: Record<string, readonly RawDirent[]> = {
    '/root': [{ name: 'folder1', type: DirentType.Directory }],
    '/root/folder1': [{ name: 'folder2', type: DirentType.Directory }],
    '/root/folder1/folder2': [{ name: 'file.txt', type: DirentType.File }],
  }
  const expandedPaths: string[] = ['/root/folder1', '/root/folder1/folder2']
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      depth: 1,
      name: 'folder1',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder1',
    },
    {
      depth: 2,
      name: 'folder2',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
      uri: '/root/folder1/folder2',
    },
    {
      depth: 3,
      name: 'file.txt',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
      uri: '/root/folder1/folder2/file.txt',
    },
  ])
})
