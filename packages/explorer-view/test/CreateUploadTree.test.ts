import { test, expect } from '@jest/globals'
import { createUploadTree } from '../src/parts/CreateUploadTree/CreateUploadTree.ts'

test('createUploadTree with files', async (): Promise<void> => {
  const blob = new Blob(['file content'])
  const fileHandle = {
    async getFile(): Promise<Blob> {
      return blob
    },
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'file',
    name: 'test.txt',
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle])
  expect(result).toEqual({
    'test.txt': { blob },
  })
})

test('createUploadTree with directories', async (): Promise<void> => {
  const blob = new Blob(['file content'])
  const fileHandle = {
    async getFile(): Promise<Blob> {
      return blob
    },
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'file',
    name: 'test.txt',
  } as FileSystemHandle

  const directoryHandle = {
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'directory',
    name: 'dir',
    values(): { [Symbol.asyncIterator](): AsyncGenerator<FileSystemHandle> } {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle
        },
      }
    },
  } as FileSystemHandle

  const result = await createUploadTree('root', [directoryHandle])
  expect(result).toEqual({
    dir: {
      'test.txt': { blob },
    },
  })
})

test('createUploadTree with mixed content', async (): Promise<void> => {
  const blob1 = new Blob(['file content 1'])
  const blob2 = new Blob(['file content 2'])
  const fileHandle1 = {
    async getFile(): Promise<Blob> {
      return blob1
    },
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'file',
    name: 'test1.txt',
  } as FileSystemHandle

  const fileHandle2 = {
    async getFile(): Promise<Blob> {
      return blob2
    },
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'file',
    name: 'test2.txt',
  } as FileSystemHandle

  const directoryHandle = {
    isSameEntry: async (): Promise<boolean> => false,
    kind: 'directory',
    name: 'dir',
    values(): { [Symbol.asyncIterator](): AsyncGenerator<FileSystemHandle> } {
      return {
        [Symbol.asyncIterator]: async function* (): AsyncGenerator<FileSystemHandle> {
          yield fileHandle2
        },
      }
    },
  } as FileSystemHandle

  const result = await createUploadTree('root', [fileHandle1, directoryHandle])
  expect(result).toEqual({
    dir: {
      'test2.txt': { blob: blob2 },
    },
    'test1.txt': { blob: blob1 },
  })
})
