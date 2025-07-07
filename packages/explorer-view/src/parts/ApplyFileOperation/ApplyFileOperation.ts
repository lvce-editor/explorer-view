import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const applyOperation = (operation: FileOperation): Promise<void> => {
  if (operation.type === FileOperationType.CreateFolder) {
    return FileSystem.mkdir(operation.path)
  }
  if (operation.type === FileOperationType.Copy) {
    return FileSystem.copy(operation.from || '', operation.path)
  }
  if (operation.type === FileOperationType.Rename) {
    return FileSystem.rename(operation.from || '', operation.path)
  }
  if (operation.type === FileOperationType.Remove) {
    return FileSystem.remove(operation.path)
  }
  return FileSystem.writeFile(operation.path, operation.text)
}
