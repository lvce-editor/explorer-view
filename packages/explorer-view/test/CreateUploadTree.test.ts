import { test, expect } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.js'

test('createUploadTree with files', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    async getFile(): Promise<{ text: () => Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content'
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle])
  expect(result).toEqual({
    'root/test.txt': 'file content',
  })
})

test('createUploadTree with directories', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    async getFile(): Promise<{ text: () => Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content'
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values(): AsyncIterable<FileSystemHandle> {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const result = await createUploadTree('root', [directoryHandle])
  expect(result).toEqual({
    'root/dir': {
      'root/dir/test.txt': 'file content',
    },
  })
})

test('createUploadTree with mixed content', async () => {
  const fileHandle1 = {
    kind: 'file',
    name: 'test1.txt',
    async getFile(): Promise<{ text: () => Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content 1'
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const fileHandle2 = {
    kind: 'file',
    name: 'test2.txt',
    async getFile(): Promise<{ text: () => Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content 2'
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values(): AsyncIterable<FileSystemHandle> {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle2
        },
      }
    },
    async isSameEntry(): Promise<boolean> {
      return false
    },
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle1, directoryHandle])
  expect(result).toEqual({
    'root/test1.txt': 'file content 1',
    'root/dir': {
      'root/dir/test2.txt': 'file content 2',
    },
  })
})
