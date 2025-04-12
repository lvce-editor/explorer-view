import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const isSymbolicLink = (dirent: ExplorerItem): boolean => {
  return dirent.type === DirentType.Symlink
}
