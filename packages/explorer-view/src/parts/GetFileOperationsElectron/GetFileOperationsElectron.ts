import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { join } from '../Path/Path.ts'

export const getFileOperationsElectron = async (
  root: string,
  paths: readonly string[],
  fileHandles: readonly FileSystemHandle[],
  pathSeparator: string,
): Promise<readonly FileOperation[]> => {
  const operations: FileOperation[] = []
  for (let i = 0; i < paths.length; i++) {
    const fileHandle = fileHandles[i]
    const { name } = fileHandle
    const path = paths[i]
    operations.push({
      from: path,
      path: join(pathSeparator, root, name),
      type: FileOperationType.Copy,
    })
  }
  return operations
}
