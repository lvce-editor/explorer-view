import { test, expect } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.js'

test('createUploadTree with files', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    async getFile() {
      return {
        async text() {
          return 'file content'
        },
      }
    },
    isSameEntry: async () => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle])
  expect(result).toEqual({
    'test.txt': 'file content',
  })
})

test('createUploadTree with directories', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    getFile: async () => ({
      text: async () => 'file content',
    }),
    isSameEntry: async () => false,
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values: () => ({
      [Symbol.asyncIterator]: async function* () {
        yield fileHandle
      },
    }),
    isSameEntry: async () => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [directoryHandle])
  expect(result).toEqual({
    dir: {
      'test.txt': 'file content',
    },
  })
})

test('createUploadTree with mixed content', async () => {
  const fileHandle1 = {
    kind: 'file',
    name: 'test1.txt',
    getFile: async () => ({
      text: async () => 'file content 1',
    }),
    isSameEntry: async () => false,
  } as FileSystemHandle

  const fileHandle2 = {
    kind: 'file',
    name: 'test2.txt',
    getFile: async () => ({
      text: async () => 'file content 2',
    }),
    isSameEntry: async () => false,
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values: () => ({
      [Symbol.asyncIterator]: async function* () {
        yield fileHandle2
      },
    }),
    isSameEntry: async () => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle1, directoryHandle])
  expect(result).toEqual({
    'test1.txt': 'file content 1',
    dir: {
      'test2.txt': 'file content 2',
    },
  })
})
