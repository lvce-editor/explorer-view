import { test, expect } from '@jest/globals'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getFileOperationsRename } from '../src/parts/GetFileOperationsRename/GetFileOperationsRename.ts'

test('should return rename operation', () => {
  const ops = getFileOperationsRename('/folder/old.txt', 'new.txt')
  expect(ops).toHaveLength(1)
  expect(ops[0].type).toBe(FileOperationType.Rename)
  if ('from' in ops[0]) {
    expect((ops[0] as any).from).toBe('/folder/old.txt')
  }
  expect(ops[0].path).toContain('new.txt')
})
