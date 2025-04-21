import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const applyOperation = (operation: FileOperation): Promise<void> => {
  if (operation.type === 'createFolder') {
    return FileSystem.mkdir(operation.path)
  }
  if (operation.type === 'copy') {
    return FileSystem.copy(operation.from || '', operation.path)
  }
  return FileSystem.writeFile(operation.path, operation.text)
}
