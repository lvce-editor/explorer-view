import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { generateUniqueName } from '../GenerateUniqueName/GenerateUniqueName.ts'
import * as Path from '../Path/Path.ts'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getFileOperationsCopy = (root: string, dirents: readonly ExplorerItem[], files: readonly string[]): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  const existingUris = dirents.map((dirent) => dirent.path)

  for (const file of files) {
    const baseName = Path.getBaseName('/', file)
    const uniqueName = generateUniqueName(baseName, existingUris, root)
    const newUri = Path.join2(root, uniqueName)
    operations.push({
      type: FileOperationType.Copy,
      from: file, // TODO ensure file is uri
      path: newUri,
    })
  }
  return operations
}
