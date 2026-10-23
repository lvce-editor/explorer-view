import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { join } from '../Path/Path.ts'

export const getFileOperationsElectron = (
  root: string,
  paths: readonly string[],
  fileHandles: readonly FileSystemHandle[],
  pathSeparator: string,
): Promise<readonly FileOperation[]> => {
  const operations: FileOperation[] = []
  for (const [i, path] of paths.entries()) {
    const fileHandle = fileHandles[i]
    const { name } = fileHandle
    operations.push({
      from: path,
      path: join(pathSeparator, root, name),
      type: FileOperationType.Copy,
    })
  }
  return Promise.resolve(operations)
}
