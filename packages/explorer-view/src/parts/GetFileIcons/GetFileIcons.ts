import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

const getFileIcon = (dirent: ExplorerItem): Promise<string> => {
  if (dirent.type === DirentType.File) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: dirent.name })
  }
  return Rpc.invoke('IconTheme.getFolderIcon', { name: dirent.name })
}

export const getFileIcons = async (dirents: readonly ExplorerItem[]): Promise<readonly string[]> => {
  const promises = dirents.map(getFileIcon)
  const icons = await Promise.all(promises)
  return icons
}
