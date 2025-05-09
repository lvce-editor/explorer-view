import { test, expect } from '@jest/globals'
import { getProtoMapInternal } from '../src/parts/GetProtoMapInternal/GetProtoMapInternal.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

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
  const pathToDirents = {
    '/root': [
      { name: 'file1.txt', type: DirentType.File },
      { name: 'file2.txt', type: DirentType.File },
    ],
  }
  const expandedPaths: string[] = []
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      name: 'file1.txt',
      posInSet: 1,
      setSize: 2,
      depth: 1,
      type: DirentType.File,
      path: '/root/file1.txt',
      icon: '',
      selected: false,
    },
    {
      name: 'file2.txt',
      posInSet: 2,
      setSize: 2,
      depth: 1,
      type: DirentType.File,
      path: '/root/file2.txt',
      icon: '',
      selected: false,
    },
  ])
})

test.skip('getProtoMapInternal - directory with subdirectories', () => {
  const root = '/root'
  const pathToDirents = {
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
      name: 'folder1',
      posInSet: 1,
      setSize: 2,
      depth: 1,
      type: DirentType.DirectoryExpanded,
      path: '/root/folder1',
      icon: '',
      selected: false,
    },
    {
      name: 'file1.txt',
      posInSet: 1,
      setSize: 1,
      depth: 2,
      type: DirentType.File,
      path: '/root/folder1/file1.txt',
      icon: '',
      selected: false,
    },
    {
      name: 'folder2',
      posInSet: 2,
      setSize: 2,
      depth: 1,
      type: DirentType.Directory,
      path: '/root/folder2',
      icon: '',
      selected: false,
    },
  ])
})

test('getProtoMapInternal - directory with different file types', () => {
  const root = '/root'
  const pathToDirents = {
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
      name: 'file.txt',
      posInSet: 1,
      setSize: 4,
      depth: 1,
      type: DirentType.File,
      path: '/root/file.txt',
      icon: '',
      selected: false,
    },
    {
      name: 'symlink.txt',
      posInSet: 2,
      setSize: 4,
      depth: 1,
      type: DirentType.SymLinkFile,
      path: '/root/symlink.txt',
      icon: '',
      selected: false,
    },
    {
      name: 'folder',
      posInSet: 3,
      setSize: 4,
      depth: 1,
      type: DirentType.Directory,
      path: '/root/folder',
      icon: '',
      selected: false,
    },
    {
      name: 'symlink-folder',
      posInSet: 4,
      setSize: 4,
      depth: 1,
      type: DirentType.SymLinkFolder,
      path: '/root/symlink-folder',
      icon: '',
      selected: false,
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
  const pathToDirents = {
    '/root': [{ name: 'folder1', type: DirentType.Directory }],
    '/root/folder1': [{ name: 'folder2', type: DirentType.Directory }],
    '/root/folder1/folder2': [{ name: 'file.txt', type: DirentType.File }],
  }
  const expandedPaths: string[] = ['/root/folder1', '/root/folder1/folder2']
  const result = getProtoMapInternal(root, pathToDirents, expandedPaths, 1)
  expect(result).toEqual([
    {
      name: 'folder1',
      posInSet: 1,
      setSize: 1,
      depth: 1,
      type: DirentType.DirectoryExpanded,
      path: '/root/folder1',
      icon: '',
      selected: false,
    },
    {
      name: 'folder2',
      posInSet: 1,
      setSize: 1,
      depth: 2,
      type: DirentType.DirectoryExpanded,
      path: '/root/folder1/folder2',
      icon: '',
      selected: false,
    },
    {
      name: 'file.txt',
      posInSet: 1,
      setSize: 1,
      depth: 3,
      type: DirentType.File,
      path: '/root/folder1/folder2/file.txt',
      icon: '',
      selected: false,
    },
  ])
})
