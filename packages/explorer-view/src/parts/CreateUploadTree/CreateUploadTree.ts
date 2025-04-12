import * as Arrays from '../Arrays/Arrays.ts'
import { getFileHandleText } from '../GetFileHandleText/GetFileHandleText.ts'
import { getChildHandles } from '../GetChildHandles/GetChildHandles.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<any> => {
  const uploadTree = Object.create(null)
  for (const fileHandle of fileHandles) {
    const path = `${root}/${fileHandle.name}`
    if (isDirectoryHandle(fileHandle)) {
      const children = await getChildHandles(fileHandle)
      const childTree = await createUploadTree(path, children)
      uploadTree[path] = childTree
    } else if (isFileHandle(fileHandle)) {
      const text = await getFileHandleText(fileHandle)
      uploadTree[path] = text
    }
  }
  return uploadTree
}
