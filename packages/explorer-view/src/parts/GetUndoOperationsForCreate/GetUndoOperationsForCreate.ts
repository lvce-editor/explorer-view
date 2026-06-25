import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'

export const getUndoOperationsForCreate = (operations: readonly FileOperation[], existingPaths: ReadonlySet<string>): readonly FileOperation[] => {
  const undoOperations: FileOperation[] = []
  for (let i = operations.length - 1; i >= 0; i--) {
    const operation = operations[i]
    if ((operation.type === FileOperationType.CreateFile || operation.type === FileOperationType.CreateFolder) && !existingPaths.has(operation.path)) {
      undoOperations.push({
        path: operation.path,
        type: FileOperationType.Remove,
      })
    }
  }
  return undoOperations
}
