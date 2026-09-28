import { expect, test } from '@jest/globals'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getFileOperations } from '../src/parts/GetFileOperations/GetFileOperations.ts'

test('getFileOperations - empty tree', () => {
  const root = '/test'
  const uploadTree = {}
  expect(getFileOperations(root, uploadTree)).toEqual([])
})

test('getFileOperations - single file', () => {
  const root = '/test'
  const uploadTree = {
    'file.txt': { blob: new Blob(['content']) },
  }
  expect(getFileOperations(root, uploadTree)).toEqual([
    { blob: uploadTree['file.txt'].blob, path: '/test/file.txt', type: FileOperationType.CreateFile },
  ])
})

test('getFileOperations - single folder', () => {
  const root = '/test'
  const uploadTree = {
    folder: {},
  }
  expect(getFileOperations(root, uploadTree)).toEqual([{ path: '/test/folder', type: FileOperationType.CreateFolder }])
})

test.skip('getFileOperations - nested structure', () => {
  const root = '/test'
  const blob1 = new Blob(['content1'])
  const blob2 = new Blob(['content2'])
  const blob3 = new Blob(['content3'])
  const uploadTree = {
    'file3.txt': { blob: blob3 },
    folder1: {
      'file1.txt': { blob: blob1 },
      subfolder: {
        'file2.txt': { blob: blob2 },
      },
    },
  }
  expect(getFileOperations(root, uploadTree)).toEqual([
    { path: '/test/folder1', type: FileOperationType.CreateFolder },
    { blob: blob1, path: '/test/folder1/file1.txt', type: FileOperationType.CreateFile },
    { path: '/test/folder1/subfolder', type: FileOperationType.CreateFolder },
    { blob: blob2, path: '/test/folder1/subfolder/file2.txt', type: FileOperationType.CreateFile },
    { blob: blob3, path: '/test/file3.txt', type: FileOperationType.CreateFile },
  ])
})
