import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import * as GetFileIconsCached from '../GetFileIconsCached/GetFileIconsCached.ts'
import * as GetMissingIconRequests from '../GetMissingIconRequests/GetMissingIconRequests.ts'
import { getPath } from '../GetPath/GetPath.ts'
import * as RequestFileIcons from '../RequestFileIcons/RequestFileIcons.ts'
import * as UpdateIconCache from '../UpdateIconCache/UpdateIconCache.ts'

interface FileIconsResult {
  readonly icons: readonly string[]
  readonly newFileIconCache: FileIconCache
}

export const getFileIcons = async (dirents: readonly ExplorerItem[], fileIconCache: FileIconCache): Promise<FileIconsResult> => {
  const missingRequests = GetMissingIconRequests.getMissingIconRequests(dirents, fileIconCache)
  const newIcons = await RequestFileIcons.requestFileIcons(missingRequests)
  const newFileIconCache = UpdateIconCache.updateIconCache(fileIconCache, missingRequests, newIcons)
  const paths = dirents.map(getPath)
  const icons = GetFileIconsCached.getIconsCached(paths, newFileIconCache)
  return {
    icons,
    newFileIconCache,
  }
}
