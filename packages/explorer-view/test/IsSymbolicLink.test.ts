import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as IsSymbolicLink from '../src/parts/IsSymbolicLink/IsSymbolicLink.ts'

test('isSymbolicLink - symlink', () => {
  const dirent = {
    type: DirentType.Symlink,
  } as any
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(true)
})

test('isSymbolicLink - file', () => {
  const dirent = {
    type: DirentType.File,
  } as any
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - directory', () => {
  const dirent = {
    type: DirentType.Directory,
  } as any
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink file', () => {
  const dirent = {
    type: DirentType.SymLinkFile,
  } as any
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})

test('isSymbolicLink - symlink folder', () => {
  const dirent = {
    type: DirentType.SymLinkFolder,
  } as any
  expect(IsSymbolicLink.isSymbolicLink(dirent)).toBe(false)
})
