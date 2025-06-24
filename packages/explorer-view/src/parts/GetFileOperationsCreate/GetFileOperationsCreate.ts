import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as Path from '../Path/Path.ts'

const getFileOperationsNestedPath = (path: string, root: string, pathSeparator: string): readonly FileOperation[] => {
  const parts = path.slice(root.length).split(pathSeparator)
  const operations: FileOperation[] = []
  let currentPath = ''
  for (const part of parts) {
    if (!part) continue
    currentPath = Path.join2(currentPath, part)
    operations.push({
      type: FileOperationType.CreateFolder,
      path: Path.join2(root, currentPath),
    })
  }
  return operations
}

export const getFileOperationsCreate = (
  newFileName: string,
  newDirentType: number,
  pathSeparator: string,
  absolutePath: string,
  root: string,
): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  const parentPath = Path.dirname(pathSeparator, absolutePath)

  operations.push(...getFileOperationsNestedPath(parentPath, root, pathSeparator))

  if (newDirentType === DirentType.File) {
    operations.push({
      type: FileOperationType.CreateFile,
      path: absolutePath,
      text: '',
    })
  } else if (newDirentType === DirentType.Directory) {
    operations.push({
      type: FileOperationType.CreateFolder,
      path: absolutePath,
    })
  }

  return operations
}
