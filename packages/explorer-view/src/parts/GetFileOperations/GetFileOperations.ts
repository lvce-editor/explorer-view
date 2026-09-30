import type { FileOperation } from '../FileOperation/FileOperation.ts'
import type { UploadTree, UploadTreeFile } from '../UploadTree/UploadTree.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { join2 } from '../Path/Path.ts'

const isUploadTreeFile = (value: UploadTree | UploadTreeFile): value is UploadTreeFile => {
  return 'blob' in value && value.blob instanceof Blob
}

export const getFileOperations = (root: string, uploadTree: UploadTree): readonly FileOperation[] => {
  const operations: FileOperation[] = []

  const processTree = (tree: UploadTree, currentPath: string): void => {
    for (const [path, value] of Object.entries(tree)) {
      const fullPath = currentPath ? join2(currentPath, path) : path
      if (isUploadTreeFile(value)) {
        operations.push({ blob: value.blob, path: join2(root, fullPath), type: FileOperationType.CreateFile })
      } else {
        operations.push({ path: join2(root, fullPath), type: FileOperationType.CreateFolder })
        processTree(value, fullPath)
      }
    }
  }

  processTree(uploadTree, '')
  return operations
}
