import { createUploadTree } from '../CreateUploadTree/CreateUploadTree.ts'

export const uploadFileSystemHandles = async (
  root: string,
  pathSeparator: string,
  fileSystemHandles: readonly FileSystemHandle[],
): Promise<boolean> => {
  const uploadTree = await createUploadTree(root, fileSystemHandles)
  console.log({ uploadTree })

  // TODO
  // 1. in electron, use webutils.getPathForFile to see if a path is available
  // 2. else, walk all files and folders recursively and upload all of them (if there are many, show a progress bar)

  // TODO send file system operations to renderer worker
  return true
}
