import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as GetGitIgnoreFiles from '../GetGitIgnoreFiles/GetGitIgnoreFiles.ts'
import * as GetGitIgnoreRelativePath from '../GetGitIgnoreRelativePath/GetGitIgnoreRelativePath.ts'
import * as IsGitIgnored from '../IsGitIgnored/IsGitIgnored.ts'

export const getGitIgnoredUris = async (
  root: string,
  items: readonly ExplorerItem[],
  pathSeparator: string,
  enabled: boolean,
  applicationId?: string,
): Promise<readonly string[]> => {
  if (!enabled || !root || items.length === 0) {
    return []
  }
  const patterns = await GetGitIgnoreFiles.getGitIgnoreFiles(root, items, pathSeparator, applicationId)
  if (patterns.length === 0) {
    return []
  }
  const matchesGitIgnore = IsGitIgnored.createGitIgnoreMatcher(patterns)
  const ignoredUris: string[] = []
  for (const item of items) {
    const relativePath = GetGitIgnoreRelativePath.getGitIgnoreRelativePath(root, item.uri, pathSeparator)
    if (matchesGitIgnore(relativePath)) {
      ignoredUris.push(item.uri)
    }
  }
  return ignoredUris
}
