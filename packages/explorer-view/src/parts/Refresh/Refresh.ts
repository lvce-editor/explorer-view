import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'
import { getExpandedDirents } from '../GetExpandedDirents/GetExpandedDirents.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getProtoMap } from '../GetProtoMap/GetProtoMap.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'

export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { applicationId } = state
  const {
    excluded,
    expandedPaths: preservedExpandedPaths,
    focusedIndex,
    gitIgnoreDecorations,
    items,
    pathSeparator,
    preserveExpandState,
    root,
  } = state
  const legacyExpandedPaths = getPaths(getExpandedDirents(items))
  const expandedPaths = preserveExpandState ? preservedExpandedPaths : legacyExpandedPaths
  const allPaths = [root, ...expandedPaths]
  const pathToDirents = await getPathDirentsMap(allPaths, applicationId)
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  const newItems = getProtoMap(root, sortedPathDirents, expandedPaths, excluded)
  let newFocusedIndex = focusedIndex
  if (focusedIndex >= newItems.length) {
    newFocusedIndex = newItems.length - 1
  }
  const sourceControlIgnoredUris = await GetGitIgnoredUris.getGitIgnoredUris(root, newItems, pathSeparator, gitIgnoreDecorations, applicationId)
  return {
    ...state,
    focusedIndex: newFocusedIndex,
    items: newItems,
    sourceControlIgnoredUris,
  }
}

export const refreshExplorer = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex } = state
  const stateWithoutEdit = editingIndex === -1 ? state : await cancelEditInternal(state, true)
  return refresh(stateWithoutEdit)
}
