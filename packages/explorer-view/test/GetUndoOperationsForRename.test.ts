import { expect, test } from '@jest/globals'
import type { FileOperation } from '../src/parts/FileOperation/FileOperation.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getUndoOperationsForRename } from '../src/parts/GetUndoOperationsForRename/GetUndoOperationsForRename.ts'

test.skip('getUndoOperationsForRename', () => {
  const operations: readonly FileOperation[] = [
    {
      from: '/workspace/before.txt',
      path: '/workspace/after.txt',
      type: FileOperationType.Rename,
    },
  ]
  const result = getUndoOperationsForRename(operations)
  expect(result).toEqual([
    {
      from: '/workspace/after.txt',
      path: '/workspace/before.txt',
      type: FileOperationType.Rename,
    },
  ])
})
