import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFileOperationsElectron } from '../GetFileOperationsElectron/GetFileOperationsElectron.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (
  root: string,
  pathSeparator: string,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
  paths: readonly string[],
): Promise<void> => {
  const operations = await getFileOperationsElectron(root, paths, fileHandles)
  await applyFileOperations(operations)
}
