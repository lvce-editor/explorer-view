import { getChildHandles } from '../GetChildHandles/GetChildHandles.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<any> => {
  const uploadTree = Object.create(null)
  for (const fileHandle of fileHandles) {
    const name = fileHandle.name
    if (isDirectoryHandle(fileHandle)) {
      const children = await getChildHandles(fileHandle)
      const childTree = await createUploadTree(name, children)
      uploadTree[name] = childTree
    } else if (isFileHandle(fileHandle)) {
      const file = await fileHandle.getFile()
      const text = await file.text()
      uploadTree[name] = text
    }
  }
  return uploadTree
}
