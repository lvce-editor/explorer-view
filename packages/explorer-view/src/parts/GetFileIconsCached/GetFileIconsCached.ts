import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import * as GetIconCacheKey from '../GetIconCacheKey/GetIconCacheKey.ts'

export const getIconsCached = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): string[] => {
  return dirents.map((dirent) => {
    const cacheKey = GetIconCacheKey.getIconCacheKey(dirent.path, dirent.type)
    return fileIconCache[cacheKey]
  })
}
