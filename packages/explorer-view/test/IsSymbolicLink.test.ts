import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsSymbolicLink from '../src/parts/IsSymbolicLink/IsSymbolicLink.ts'

test('isSymbolicLink - symlink', () => {
  const dirent: ExplorerItem = {
    name: 'symlink',
    type: DirentType.Symlink,
    path: '/symlink',
    depth: 0,
    selected: false,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(true)
})

test('isSymbolicLink - file', () => {
  const dirent: ExplorerItem = {
    name: 'file.txt',
    type: DirentType.File,
    path: '/file.txt',
    depth: 0,
    selected: false,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - directory', () => {
  const dirent: ExplorerItem = {
    name: 'directory',
    type: DirentType.Directory,
    path: '/directory',
    depth: 0,
    selected: false,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink file', () => {
  const dirent: ExplorerItem = {
    name: 'symlink-file',
    type: DirentType.SymLinkFile,
    path: '/symlink-file',
    depth: 0,
    selected: false,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink folder', () => {
  const dirent: ExplorerItem = {
    name: 'symlink-folder',
    type: DirentType.SymLinkFolder,
    path: '/symlink-folder',
    depth: 0,
    selected: false,
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})
