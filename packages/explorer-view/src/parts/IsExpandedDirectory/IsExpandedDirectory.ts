import * as DirentType from '../DirentType/DirentType.ts'

export const isExpandedDirectory = (dirent: any): boolean => {
  return dirent.type === DirentType.DirectoryExpanded
}
