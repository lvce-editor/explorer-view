import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFileOperationsElectron } from '../GetFileOperationsElectron/GetFileOperationsElectron.ts'
import { getFilePaths } from '../GetFilePaths/GetFilePaths.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (
  root: string,
  pathSeparator: string,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
): Promise<void> => {
  const paths = await getFilePaths(files)
  const operations = await getFileOperationsElectron(root, paths, fileHandles)
  await applyFileOperations(operations)
}
