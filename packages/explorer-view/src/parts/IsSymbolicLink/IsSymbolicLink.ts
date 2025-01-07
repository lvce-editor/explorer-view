import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isSymbolicLink = (dirent: ExplorerItem): any => {
  return dirent.type === DirentType.Symlink
}
