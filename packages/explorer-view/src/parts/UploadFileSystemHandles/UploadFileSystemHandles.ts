import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { createUploadTree } from '../CreateUploadTree/CreateUploadTree.ts'
import * as GetFileOperations from '../GetFileOperations/GetFileOperations.ts'

export const uploadFileSystemHandles = async (
  root: string,
  pathSeparator: string,
  fileSystemHandles: readonly FileSystemHandle[],
): Promise<boolean> => {
  if (fileSystemHandles.length === 0) {
    return true
  }
  const uploadTree = await createUploadTree(root, fileSystemHandles)
  const fileOperations = GetFileOperations.getFileOperations(root, uploadTree)
  await ApplyFileOperations.applyFileOperations(fileOperations)

  // TODO
  // 1. in electron, use webutils.getPathForFile to see if a path is available
  // 2. else, walk all files and folders recursively and upload all of them (if there are many, show a progress bar)

  // TODO send file system operations to renderer worker
  return true
}
