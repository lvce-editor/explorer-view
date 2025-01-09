import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

const getFileIcon = async (dirent: ExplorerItem, fileIconCache: FileIconCache): Promise<[string, string]> => {
  const cacheKey = `${dirent.type}:${dirent.name}`
  if (cacheKey in fileIconCache) {
    return [cacheKey, fileIconCache[cacheKey]]
  }

  const icon =
    dirent.type === DirentType.File
      ? await Rpc.invoke('IconTheme.getFileIcon', { name: dirent.name })
      : await Rpc.invoke('IconTheme.getFolderIcon', { name: dirent.name })

  return [cacheKey, icon]
}

export const getFileIcons = async (
  dirents: readonly ExplorerItem[],
  fileIconCache: FileIconCache,
): Promise<{
  icons: readonly string[]
  newFileIconCache: FileIconCache
}> => {
  const iconResults = await Promise.all(dirents.map((dirent) => getFileIcon(dirent, fileIconCache)))

  const newFileIconCache = { ...fileIconCache }
  const icons: string[] = []

  for (const [cacheKey, icon] of iconResults) {
    newFileIconCache[cacheKey] = icon
    icons.push(icon)
  }

  return {
    icons,
    newFileIconCache,
  }
}
