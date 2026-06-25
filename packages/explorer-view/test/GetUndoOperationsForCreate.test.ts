import { expect, test } from '@jest/globals'
import type { FileOperation } from '../src/parts/FileOperation/FileOperation.ts'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getUndoOperationsForCreate } from '../src/parts/GetUndoOperationsForCreate/GetUndoOperationsForCreate.ts'

test.skip('getUndoOperationsForCreate - nested file', () => {
  const operations: readonly FileOperation[] = [
    { path: '/workspace/a', type: FileOperationType.CreateFolder },
    { path: '/workspace/a/b', type: FileOperationType.CreateFolder },
    { path: '/workspace/a/b/created.txt', text: '', type: FileOperationType.CreateFile },
  ]
  const result = getUndoOperationsForCreate(operations, new Set())
  expect(result).toEqual([
    { path: '/workspace/a/b/created.txt', type: FileOperationType.Remove },
    { path: '/workspace/a/b', type: FileOperationType.Remove },
    { path: '/workspace/a', type: FileOperationType.Remove },
  ])
})

test.skip('getUndoOperationsForCreate - skips existing parent folders', () => {
  const operations: readonly FileOperation[] = [
    { path: '/workspace/a', type: FileOperationType.CreateFolder },
    { path: '/workspace/a/created.txt', text: '', type: FileOperationType.CreateFile },
  ]
  const result = getUndoOperationsForCreate(operations, new Set(['/workspace/a']))
  expect(result).toEqual([{ path: '/workspace/a/created.txt', type: FileOperationType.Remove }])
})
