import type { FileOperation } from '../FileOperation/FileOperation.ts'
import { join2 } from '../Path/Path.ts'

export const getFileOperationsElectron = async (
  root: string,
  paths: readonly string[],
  fileHandles: readonly FileSystemHandle[],
): Promise<readonly FileOperation[]> => {
  const operations: FileOperation[] = []
  for (let i = 0; i < paths.length; i++) {
    const fileHandle = fileHandles[i]
    const { name } = fileHandle
    const path = paths[i]
    operations.push({
      type: 'copy',
      path: join2(root, name),
      text: '',
      from: path,
    })
  }
  return operations
}
