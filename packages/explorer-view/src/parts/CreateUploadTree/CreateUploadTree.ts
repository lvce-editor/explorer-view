import * as Arrays from '../Arrays/Arrays.ts'

const isDirectoryHandle = (fileHandle: FileSystemHandle): fileHandle is FileSystemDirectoryHandle => {
  return fileHandle.kind === 'directory'
}

export const createUploadTree = async (root: string, fileHandles: readonly FileSystemHandle[]): Promise<any> => {
  const uploadTree = Object.create(null)
  for (const fileHandle of fileHandles) {
    if (isDirectoryHandle(fileHandle)) {
      // @ts-ignore
      const values = fileHandle.values()
      const children = await Arrays.fromAsync(values)
      console.log({ children })
    }
  }
  return uploadTree
}
