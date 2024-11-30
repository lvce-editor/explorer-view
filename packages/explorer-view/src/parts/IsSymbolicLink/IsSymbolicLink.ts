import * as DirentType from '../DirentType/DirentType.ts'

export const isSymbolicLink = (dirent: any): any => {
  return dirent.type === DirentType.Symlink
}
