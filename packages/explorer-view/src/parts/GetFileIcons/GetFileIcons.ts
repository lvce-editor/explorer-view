import * as Rpc from '../ParentRpc/ParentRpc.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const getFileIcon = (dirent: any): Promise<string> => {
  if (dirent.type === DirentType.File) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: dirent.name })
  }
  return Rpc.invoke('IconTheme.getFolderIcon', { name: dirent.name })
}

export const getFileIcons = async (dirents: readonly any[]): Promise<readonly string[]> => {
  const promises = dirents.map(getFileIcon)
  const icons = await Promise.all(promises)
  return icons
}
