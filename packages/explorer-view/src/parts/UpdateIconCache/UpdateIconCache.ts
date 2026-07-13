import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'
import * as GetIconCacheKey from '../GetIconCacheKey/GetIconCacheKey.ts'

export const updateIconCache = (iconCache: FileIconCache, missingRequests: readonly IconRequest[], newIcons: readonly string[]): FileIconCache => {
  if (missingRequests.length === 0) {
    return iconCache
  }
  const newFileIconCache = { ...iconCache }
  for (let i = 0; i < missingRequests.length; i++) {
    const request = missingRequests[i]
    const icon = newIcons[i]
    const cacheKey = GetIconCacheKey.getIconCacheKey(request.path, request.type)
    newFileIconCache[cacheKey] = icon
  }
  return newFileIconCache
}
