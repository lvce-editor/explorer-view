import * as DirentType from '../DirentType/DirentType.ts'

export const getSymlinkType = (type: any): any => {
  switch (type) {
    case DirentType.File:
      return DirentType.SymLinkFile
    case DirentType.Directory:
      return DirentType.SymLinkFolder
    default:
      return DirentType.Symlink
  }
}
