import * as DirentType from '../DirentType/DirentType.ts'
import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const canBeDroppedInto = (dirent: ExplorerItem): boolean => {
  if (!dirent) {
    return false
  }
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return true
    default:
      return false
  }
}
