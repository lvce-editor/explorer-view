import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFileOperationsElectron } from '../GetFileOperationsElectron/GetFileOperationsElectron.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (root: string, fileHandles: DroppedArgs, files: readonly File[], paths: readonly string[]): Promise<void> => {
  const operations = await getFileOperationsElectron(root, paths, fileHandles, PathSeparatorType.Slash)
  await applyFileOperations(operations)
}
