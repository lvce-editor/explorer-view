import { test, expect } from '@jest/globals'
import type { FileOperation } from '../src/parts/FileOperation/FileOperation.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import * as ValidateOperations from '../src/parts/ValidateOperations/ValidateOperations.ts'

test('should return empty array when no operations provided', () => {
  const result = ValidateOperations.validateOperations([])
  expect(result).toEqual([])
})

test('should return empty array when operations contain only non-copy operations', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.CreateFile,
      path: '/home/user/file.txt',
      text: 'content',
    },
    {
      type: FileOperationType.CreateFolder,
      path: '/home/user/folder',
    },
    {
      type: FileOperationType.Rename,
      from: '/home/user/old.txt',
      path: '/home/user/new.txt',
    },
    {
      type: FileOperationType.Remove,
      path: '/home/user/delete.txt',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return empty array when copy operations are valid', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder2',
    },
    {
      type: FileOperationType.Copy,
      from: 'test:///file.txt',
      path: 'test:///copied.txt',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return error when copying folder into its own subfolder', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1/subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should return error when copying folder into nested subfolder', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1/subfolder/nested',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should return error with Windows path separators', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1\\subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should return empty array when copying file into folder', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///file.txt',
      path: 'test:///folder/file.txt',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return empty array when copying folder to different location', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder2',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return empty array when copying folder to parent directory', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1/subfolder',
      path: 'test:///folder1',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return empty array when paths are exactly the same', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual([])
})

test('should return errors for all invalid operations when multiple operations', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder2', // valid
    },
    {
      type: FileOperationType.Copy,
      from: 'test:///folder3',
      path: 'test:///folder3/subfolder', // invalid
    },
    {
      type: FileOperationType.Copy,
      from: 'test:///folder4',
      path: 'test:///folder4/nested', // also invalid
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder3 into a subfolder of itself', 'Cannot copy folder folder4 into a subfolder of itself'])
})

test('should handle mixed operation types with invalid copy', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.CreateFile,
      path: 'test:///file.txt',
      text: 'content',
    },
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1/subfolder', // invalid
    },
    {
      type: FileOperationType.Rename,
      from: 'test:///old.txt',
      path: 'test:///new.txt',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should handle paths with trailing separators', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1/',
      path: 'test:///folder1/subfolder/',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should handle mixed path separators', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1\\subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should handle relative paths', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder1',
      path: 'test:///folder1/subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should handle deep nested paths', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///a/b/c/d/e/folder1',
      path: 'test:///a/b/c/d/e/folder1/subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder1 into a subfolder of itself'])
})

test('should handle single character folder names', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///a',
      path: 'test:///a/b',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder a into a subfolder of itself'])
})

test('should handle folder names with special characters', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///folder-name_123',
      path: 'test:///folder-name_123/subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder folder-name_123 into a subfolder of itself'])
})

test('should handle empty folder names', () => {
  const operations: FileOperation[] = [
    {
      type: FileOperationType.Copy,
      from: 'test:///',
      path: 'test:///subfolder',
    },
  ]
  const result = ValidateOperations.validateOperations(operations)
  expect(result).toEqual(['Cannot copy folder test: into a subfolder of itself'])
})
