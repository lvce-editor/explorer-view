import * as Assert from '../Assert/Assert.ts'

const getFileExtensionIndex = (file: any): any => {
  Assert.string(file)
  return file.lastIndexOf('.')
}

export const getFileExtension = (file: any): any => {
  const index = getFileExtensionIndex(file)
  return file.slice(index)
}
