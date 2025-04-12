import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'
import { isFileHandle } from '../IsFileHandle/IsFileHandle.ts'

const getFilepath = async (fileHandle: FileSystemHandle): Promise<string> => {
  if (isFileHandle(fileHandle)) {
    const file = await fileHandle.getFile()
    return GetFilePathElectron.getFilePathElectron(file)
  }
  console.log({ fileHandle })
  return ''
}

export const getFilePaths = async (files: readonly FileSystemHandle[]): Promise<readonly string[]> => {
  const promises = files.map(getFilepath)
  const paths = await Promise.all(promises)
  return paths
}
