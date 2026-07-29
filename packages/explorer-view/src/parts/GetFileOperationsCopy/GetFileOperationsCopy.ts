import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { generateUniqueName } from '../GenerateUniqueName/GenerateUniqueName.ts'
import * as Path from '../Path/Path.ts'

export const getFileOperationsCopy = (targetUri: string, existingUris: readonly string[], files: readonly string[]): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  const reservedUris = [...existingUris]

  for (const file of files) {
    const baseName = Path.getBaseName('/', file)
    const uniqueName = generateUniqueName(baseName, reservedUris, targetUri)
    const newUri = Path.join2(targetUri, uniqueName)
    operations.push({
      from: file,
      path: newUri,
      type: FileOperationType.Copy,
    })
    reservedUris.push(newUri)
  }
  return operations
}
