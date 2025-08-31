import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { generateUniqueName } from '../GenerateUniqueName/GenerateUniqueName.ts'
import * as Path from '../Path/Path.ts'

export const getFileOperationsCopy = (
  root: string,
  existingUris: readonly string[],
  files: readonly string[],
  focusedUri: string,
): readonly FileOperation[] => {
  const operations: FileOperation[] = []

  for (const file of files) {
    const baseName = Path.getBaseName('/', file)
    if (existingUris.includes(file)) {
      operations.push({
        type: FileOperationType.Rename,
        from: file,
        path: Path.join2(focusedUri, baseName),
      })
    } else {
      const uniqueName = generateUniqueName(baseName, existingUris, root)
      const newUri = Path.join2(root, uniqueName)
      operations.push({
        type: FileOperationType.Copy,
        from: file, // TODO ensure file is uri
        path: newUri,
      })
    }
  }
  return operations
}
