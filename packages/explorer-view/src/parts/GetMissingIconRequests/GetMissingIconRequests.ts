import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'
import * as GetIconCacheKey from '../GetIconCacheKey/GetIconCacheKey.ts'

const getMissingDirents = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): readonly ExplorerItem[] => {
  const missingDirents: ExplorerItem[] = []
  for (const dirent of dirents) {
    const cacheKey = GetIconCacheKey.getIconCacheKey(dirent.uri, dirent.type)
    if (!(cacheKey in fileIconCache)) {
      missingDirents.push(dirent)
    }
  }
  return missingDirents
}

const toIconRequest = (dirent: ExplorerItem): IconRequest => {
  const cacheKey = GetIconCacheKey.getIconCacheKey(dirent.uri, dirent.type)
  return {
    ...(cacheKey !== dirent.uri && { expanded: true }),
    name: dirent.name,
    path: dirent.uri,
    type: dirent.type,
  }
}

export const getMissingIconRequests = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): readonly IconRequest[] => {
  const missingRequests = getMissingDirents(dirents, fileIconCache)
  const iconRequests = missingRequests.map(toIconRequest)
  return iconRequests
}
