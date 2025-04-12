import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'

const getFilepath = async (file: File): Promise<string> => {
  return GetFilePathElectron.getFilePathElectron(file)
}

export const getFilePaths = async (files: readonly File[]): Promise<readonly string[]> => {
  const promises = files.map(getFilepath)
  const paths = await Promise.all(promises)
  return paths
}
