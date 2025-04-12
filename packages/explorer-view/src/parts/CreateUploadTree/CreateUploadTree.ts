import * as Arrays from '../Arrays/Arrays.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<any> => {
  const uploadTree = Object.create(null)
  for (const fileHandle of fileHandles) {
    const path = `${root}/${fileHandle.name}`
    if (isDirectoryHandle(fileHandle)) {
      // @ts-ignore
      const values = fileHandle.values()
      const children = await Arrays.fromAsync(values)
      const childTree = await createUploadTree(path, children)
      uploadTree[path] = childTree
    } else if (isFileHandle(fileHandle)) {
      const file = await fileHandle.getFile()
      const text = await file.text()
      uploadTree[path] = text
    }
  }
  return uploadTree
}
