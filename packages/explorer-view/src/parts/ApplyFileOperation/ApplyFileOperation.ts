import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const applyOperation = (operation: FileOperation, applicationId?: string): Promise<void> => {
  switch (operation.type) {
    case FileOperationType.Copy:
      return FileSystem.copy(operation.from || '', operation.path, applicationId)
    case FileOperationType.CreateFolder:
      return FileSystem.mkdir(operation.path, applicationId)
    case FileOperationType.Remove:
      return FileSystem.remove(operation.path, applicationId)
    case FileOperationType.Rename:
      return FileSystem.rename(operation.from || '', operation.path, applicationId)
    default:
      return FileSystem.writeFile(operation.path, operation.text, applicationId)
  }
}
