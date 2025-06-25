import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as Path from '../Path/Path.ts'

export const getFileOperationsCopy = (root: string, files: readonly string[]): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  for (const file of files) {
    const baseName = Path.getBaseName('/', file)
    const newUri = Path.join2(root, baseName)
    operations.push({
      type: FileOperationType.Copy,
      from: file, // TODO ensure file is uri
      path: newUri,
    })
  }
  return operations
}
