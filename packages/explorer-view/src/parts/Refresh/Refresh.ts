import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getExpandedDirents } from '../GetExpandedDirents/GetExpandedDirents.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getProtoMap } from '../GetProtoMap/GetProtoMap.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'

export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { excluded, focusedIndex, gitIgnoreDecorations, items, pathSeparator, root } = state
  const expandedDirents = getExpandedDirents(items)
  const expandedPaths = getPaths(expandedDirents)
  const allPaths = [root, ...expandedPaths]
  const pathToDirents = await getPathDirentsMap(allPaths)
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  const newItems = getProtoMap(root, sortedPathDirents, expandedPaths, excluded)
  let newFocusedIndex = focusedIndex
  if (focusedIndex >= newItems.length) {
    newFocusedIndex = newItems.length - 1
  }
  const sourceControlIgnoredUris = await GetGitIgnoredUris.getGitIgnoredUris(root, newItems, pathSeparator, gitIgnoreDecorations)
  return {
    ...state,
    focusedIndex: newFocusedIndex,
    items: newItems,
    sourceControlIgnoredUris,
  }
}
