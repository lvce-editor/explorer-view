import { expect, test } from '@jest/globals'
import { getFileOperations } from '../src/parts/GetFileOperations/GetFileOperations.ts'

test('getFileOperations - empty tree', () => {
  const root = '/test'
  const uploadTree = {}
  expect(getFileOperations(root, uploadTree)).toEqual([])
})

test('getFileOperations - single file', () => {
  const root = '/test'
  const uploadTree = {
    'file.txt': 'content',
  }
  expect(getFileOperations(root, uploadTree)).toEqual([{ type: 'createFile', path: '/test/file.txt', text: 'content' }])
})

test('getFileOperations - single folder', () => {
  const root = '/test'
  const uploadTree = {
    folder: {},
  }
  expect(getFileOperations(root, uploadTree)).toEqual([{ type: 'createFolder', path: '/test/folder', text: '' }])
})

test('getFileOperations - nested structure', () => {
  const root = '/test'
  const uploadTree = {
    folder1: {
      'file1.txt': 'content1',
      subfolder: {
        'file2.txt': 'content2',
      },
    },
    'file3.txt': 'content3',
  }
  expect(getFileOperations(root, uploadTree)).toEqual([
    { type: 'createFolder', path: '/test/folder1', text: '' },
    { type: 'createFile', path: '/test/folder1/file1.txt', text: 'content1' },
    { type: 'createFolder', path: '/test/folder1/subfolder', text: '' },
    { type: 'createFile', path: '/test/folder1/subfolder/file2.txt', text: 'content2' },
    { type: 'createFile', path: '/test/file3.txt', text: 'content3' },
  ])
})
