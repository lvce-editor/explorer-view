import type { FileOperation } from '../GetFileOperations/GetFileOperations.ts'
import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFileHandleText } from '../GetFileHandleText/GetFileHandleText.ts'
import { getFilePaths } from '../GetFilePaths/GetFilePaths.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const getFileOperationsElectron = async (
  root: string,
  paths: readonly string[],
  fileHandles: readonly FileSystemHandle[],
): Promise<readonly FileOperation[]> => {
  const operations: FileOperation[] = []
  for (let i = 0; i < paths.length; i++) {
    const fileHandle = fileHandles[i]
    const name = fileHandle.name
    if (isDirectoryHandle(fileHandle)) {
      operations.push({
        type: 'createFolder',
        path: `${root}/${name}`,
        text: '',
      })
    } else if (isFileHandle(fileHandle)) {
      const text = await getFileHandleText(fileHandle)
      operations.push({
        type: 'createFile',
        path: `${root}/${name}`,
        text,
      })
    }
  }
  return operations
}
