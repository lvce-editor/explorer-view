import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

const applyOperation = (operation: FileOperation): Promise<void> => {
  if (operation.type === 'createFolder') {
    return FileSystem.mkdir(operation.path)
  }
  return FileSystem.writeFile(operation.path, operation.text)
}

export const applyFileOperations = async (operations: readonly FileOperation[]): Promise<void> => {
  // TODO run operations in parallel if possible
  for (const operation of operations) {
    await applyOperation(operation)
  }
}
