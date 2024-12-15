import * as HandleClickFile from '../HandleClickFile/HandleClickFile.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const handleClickSymLink = async (state: any, dirent: any, index: any): Promise<any> => {
  const realPath = await FileSystem.getRealPath(dirent.path)
  const type = await FileSystem.stat(realPath)
  switch (type) {
    case DirentType.File:
      return HandleClickFile.handleClickFile(state, dirent, index)
    default:
      throw new Error(`unsupported file type ${type}`)
  }
}
