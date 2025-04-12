import * as DirentType from '../DirentType/DirentType.ts'

export const getSymlinkType = (type: number): number => {
  switch (type) {
    case DirentType.File:
      return DirentType.SymLinkFile
    case DirentType.Directory:
      return DirentType.SymLinkFolder
    default:
      return DirentType.Symlink
  }
}
