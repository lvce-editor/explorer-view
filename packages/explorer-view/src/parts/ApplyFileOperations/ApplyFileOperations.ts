import type { FileOperation } from '../FileOperation/FileOperation.ts'
import { applyOperation as applyFileOperation } from '../ApplyFileOperation/ApplyFileOperation.ts'

export const applyFileOperations = async (operations: readonly FileOperation[]): Promise<void> => {
  // TODO run operations in parallel if possible
  for (const operation of operations) {
    await applyFileOperation(operation)
  }
}
