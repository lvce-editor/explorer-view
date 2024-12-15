import * as DirentType from '../DirentType/DirentType.ts'

export const toCollapsedDirent = (dirent: any) => {
  if (dirent.type === DirentType.DirectoryExpanded) {
    return {
      ...dirent,
      type: DirentType.Directory,
    }
  }
  return dirent
}
