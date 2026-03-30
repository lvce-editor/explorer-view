import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { createUploadTree } from '../CreateUploadTree/CreateUploadTree.ts'
import * as GetFileOperations from '../GetFileOperations/GetFileOperations.ts'

interface DroppedFile {
  readonly kind: 'file'
  readonly value: FileSystemFileHandle
}

type DroppedArgs = readonly DroppedFile[] | readonly FileSystemDirectoryHandle[]

const isDroppedFile = (item: DroppedFile | FileSystemDirectoryHandle): item is DroppedFile => {
  return item.kind === 'file' && 'value' in item && item.value instanceof FileSystemHandle
}

const getFileSystemHandlesNormalized = (fileSystemHandles: DroppedArgs): readonly FileSystemHandle[] => {
  const normalized: FileSystemHandle[] = []
  for (const item of fileSystemHandles) {
    if (isDroppedFile(item)) {
      normalized.push(item.value)
    } else {
      normalized.push(item)
    }
  }
  return normalized
}

export const uploadFileSystemHandles = async (root: string, pathSeparator: string, fileSystemHandles: DroppedArgs): Promise<boolean> => {
  if (fileSystemHandles.length === 0) {
    return true
  }
  const fileSystemHandlesNormalized = getFileSystemHandlesNormalized(fileSystemHandles)
  const uploadTree = await createUploadTree(root, fileSystemHandlesNormalized)
  const fileOperations = GetFileOperations.getFileOperations(root, uploadTree)
  await ApplyFileOperations.applyFileOperations(fileOperations)

  // TODO
  // 1. in electron, use webutils.getPathForFile to see if a path is available
  // 2. else, walk all files and folders recursively and upload all of them (if there are many, show a progress bar)

  // TODO send file system operations to renderer worker
  return true
}
