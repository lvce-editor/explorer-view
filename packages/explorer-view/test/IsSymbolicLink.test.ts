import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsSymbolicLink from '../src/parts/IsSymbolicLink/IsSymbolicLink.ts'

test('isSymbolicLink - symlink', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink',
    selected: false,
    type: DirentType.Symlink,
    uri: '/symlink',
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(true)
})

test('isSymbolicLink - file', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'file.txt',
    selected: false,
    type: DirentType.File,
    uri: '/file.txt',
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - directory', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'directory',
    selected: false,
    type: DirentType.Directory,
    uri: '/directory',
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink file', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink-file',
    selected: false,
    type: DirentType.SymLinkFile,
    uri: '/symlink-file',
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink folder', () => {
  const dirent: ExplorerItem = {
    depth: 0,
    name: 'symlink-folder',
    selected: false,
    type: DirentType.SymLinkFolder,
    uri: '/symlink-folder',
  }
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})
