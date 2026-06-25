import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'

export const getUndoOperationsForRename = (operations: readonly FileOperation[]): readonly FileOperation[] => {
  const undoOperations: FileOperation[] = []
  for (let i = operations.length - 1; i >= 0; i--) {
    const operation = operations[i]
    if (operation.type === FileOperationType.Rename) {
      undoOperations.push({
        from: operation.path,
        path: operation.from,
        type: FileOperationType.Rename,
      })
    }
  }
  return undoOperations
}
