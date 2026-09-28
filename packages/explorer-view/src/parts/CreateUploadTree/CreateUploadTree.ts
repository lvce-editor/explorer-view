import type { UploadTree } from '../UploadTree/UploadTree.ts'
import { getChildHandles } from '../GetChildHandles/GetChildHandles.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<UploadTree> => {
  const uploadTree = Object.create(null) as UploadTree
  const normalized = fileHandles.filter(Boolean)
  for (const fileHandle of normalized) {
    const { name } = fileHandle
    if (isDirectoryHandle(fileHandle)) {
      const children = await getChildHandles(fileHandle)
      const childTree = await createUploadTree(name, children)
      uploadTree[name] = childTree
    } else if (isFileHandle(fileHandle)) {
      const blob = await fileHandle.getFile()
      uploadTree[name] = { blob }
    }
  }
  return uploadTree
}
