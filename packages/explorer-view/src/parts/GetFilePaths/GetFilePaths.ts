import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'

const getFilepath = (file: FileSystemHandle): Promise<string> => {
  // @ts-ignore
  return GetFilePathElectron.getFilePathElectron(file)
}

export const getFilePaths = async (files: readonly FileSystemHandle[]): Promise<readonly string[]> => {
  const promises = files.map(getFilepath)
  const paths = await Promise.all(promises)
  return paths
}
