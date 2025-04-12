import type { FileOperation } from '../GetFileOperations/GetFileOperations.ts'
import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFilePaths } from '../GetFilePaths/GetFilePaths.ts'

const getOperations = (root: string, paths: readonly string[]): readonly FileOperation[] => {
  // TODO
  return []
}

// TODO copy files in parallel
export const copyFilesElectron = async (
  root: string,
  pathSeparator: string,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
): Promise<void> => {
  const paths = await getFilePaths(files)
  const operations = getOperations(root, paths)
  await applyFileOperations(operations)
}
