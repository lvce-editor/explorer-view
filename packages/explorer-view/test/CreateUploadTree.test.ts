import { test, expect } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.ts'

test('createUploadTree with files', async (): Promise<void> => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    async getFile(): Promise<{ text(): Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content'
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle])
  expect(result).toEqual({
    'test.txt': 'file content',
  })
})

test('createUploadTree with directories', async (): Promise<void> => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
    async getFile(): Promise<{ text(): Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content'
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values(): { [Symbol.asyncIterator](): AsyncGenerator<FileSystemHandle> } {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [directoryHandle])
  expect(result).toEqual({
    dir: {
      'test.txt': 'file content',
    },
  })
})

test('createUploadTree with mixed content', async (): Promise<void> => {
  const fileHandle1 = {
    kind: 'file',
    name: 'test1.txt',
    async getFile(): Promise<{ text(): Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content 1'
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const fileHandle2 = {
    kind: 'file',
    name: 'test2.txt',
    async getFile(): Promise<{ text(): Promise<string> }> {
      return {
        async text(): Promise<string> {
          return 'file content 2'
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const directoryHandle = {
    kind: 'directory',
    name: 'dir',
    values(): { [Symbol.asyncIterator](): AsyncGenerator<FileSystemHandle> } {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle2
        },
      }
    },
    isSameEntry: async (): Promise<boolean> => false,
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle1, directoryHandle])
  expect(result).toEqual({
    'test1.txt': 'file content 1',
    dir: {
      'test2.txt': 'file content 2',
    },
  })
})
