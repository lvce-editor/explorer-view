import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as GetGitIgnoreFiles from '../GetGitIgnoreFiles/GetGitIgnoreFiles.ts'
import * as GetGitIgnoreRelativePath from '../GetGitIgnoreRelativePath/GetGitIgnoreRelativePath.ts'
import * as IsGitIgnored from '../IsGitIgnored/IsGitIgnored.ts'

export const getGitIgnoredUris = async (
  root: string,
  items: readonly ExplorerItem[],
  pathSeparator: string,
  enabled: boolean,
): Promise<readonly string[]> => {
  if (!enabled || !root || items.length === 0) {
    return []
  }
  const patterns = await GetGitIgnoreFiles.getGitIgnoreFiles(root, items, pathSeparator)
  if (patterns.length === 0) {
    return []
  }
  return items
    .filter((item) => {
      const relativePath = GetGitIgnoreRelativePath.getGitIgnoreRelativePath(root, item.path, pathSeparator)
      return IsGitIgnored.isGitIgnored(relativePath, patterns)
    })
    .map((item) => item.path)
}
