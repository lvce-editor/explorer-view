import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { join2 } from '../Path/Path.ts'

export const getFileOperations = (root: string, uploadTree: any): readonly FileOperation[] => {
  const operations: FileOperation[] = []

  const processTree = (tree: any, currentPath: string): void => {
    for (const [path, value] of Object.entries(tree)) {
      const fullPath = currentPath ? join2(currentPath, path) : path
      if (typeof value === 'object') {
        operations.push({ type: FileOperationType.CreateFolder, path: join2(root, fullPath) })
        processTree(value, fullPath)
      } else if (typeof value === 'string') {
        operations.push({ type: FileOperationType.CreateFile, path: join2(root, fullPath), text: value })
      }
    }
  }

  processTree(uploadTree, '')
  return operations
}
