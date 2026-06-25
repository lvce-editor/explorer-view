import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileOperation } from '../FileOperation/FileOperation.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { isDirectoryType } from '../IsDirectoryType/IsDirectoryType.ts'
import * as Path from '../Path/Path.ts'

const collectChildOperations = async (path: string, pathSeparator: string, operations: FileOperation[]): Promise<void> => {
  let children: readonly RawDirent[]
  try {
    children = await FileSystem.readDirWithFileTypes(path)
  } catch {
    return
  }
  for (const child of children) {
    const childPath = Path.join(pathSeparator, path, child.name)
    if (isDirectoryType(child.type)) {
      operations.push({
        path: childPath,
        type: FileOperationType.CreateFolder,
      })
      await collectChildOperations(childPath, pathSeparator, operations)
      continue
    }
    operations.push({
      path: childPath,
      text: '',
      type: FileOperationType.CreateFile,
    })
  }
}

export const getUndoOperationsForDelete = async (items: readonly ExplorerItem[], pathSeparator: string): Promise<readonly FileOperation[]> => {
  const undoOperations: FileOperation[] = []
  for (const item of items) {
    if (isDirectoryType(item.type)) {
      undoOperations.push({
        path: item.path,
        type: FileOperationType.CreateFolder,
      })
      await collectChildOperations(item.path, pathSeparator, undoOperations)
      continue
    }
    if (item.type === DirentType.File) {
      undoOperations.push({
        path: item.path,
        text: '',
        type: FileOperationType.CreateFile,
      })
    }
  }
  return undoOperations
}
