import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'

export const getMissingIconRequests = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): readonly IconRequest[] => {
  const missingRequests: IconRequest[] = []

  for (const dirent of dirents) {
    const cacheKey = `${dirent.type}:${dirent.name}`
    if (!(cacheKey in fileIconCache)) {
      missingRequests.push({
        type: dirent.type,
        name: dirent.name,
        path: dirent.path,
      })
    }
  }

  return missingRequests
}
