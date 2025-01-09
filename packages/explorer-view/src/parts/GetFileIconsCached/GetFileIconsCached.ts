import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'

export const getIconsCached = (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): string[] => {
  return dirents.map((dirent) => fileIconCache[`${dirent.type}:${dirent.name}`])
}
