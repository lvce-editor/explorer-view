import * as DirentType from '../DirentType/DirentType.ts'

export const makeExpanded = (dirent: any): any => {
  if (dirent.type === DirentType.Directory) {
    return {
      ...dirent,
      type: DirentType.DirectoryExpanded,
    }
  }
  return dirent
}
