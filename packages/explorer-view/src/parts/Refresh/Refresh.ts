import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getExpandedDirents } from '../GetExpandedDirents/GetExpandedDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getProtoMap } from '../GetProtoMap/GetProtoMap.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'

export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const {
    root,
    minLineY,
    height,
    itemHeight,
    fileIconCache,
    cutItems,
    sourceControlIgnoredUris,
    dropTargets,
    editingErrorMessage,
    editingIcon,
    editingIndex,
    editingType,
    editingValue,
    focusedIndex,
    items,
    useChevrons,
  } = state
  const expandedDirents = getExpandedDirents(items)
  const expandedPaths = getPaths(expandedDirents)
  const allPaths = [root, ...expandedPaths]
  const pathToDirents = await getPathDirentsMap(allPaths)
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  const newItems = getProtoMap(root, sortedPathDirents, expandedPaths)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newItems.length)
  const visible = newItems.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  let newFocusedIndex = focusedIndex
  if (focusedIndex >= newItems.length) {
    newFocusedIndex = newItems.length - 1
  }
  const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
    items,
    minLineY,
    maxLineY,
    focusedIndex,
    editingIndex,
    editingType,
    editingValue,
    editingErrorMessage,
    icons,
    useChevrons,
    dropTargets,
    editingIcon,
    cutItems,
    sourceControlIgnoredUris,
  )
  return {
    ...state,
    fileIconCache: newFileIconCache,
    focusedIndex: newFocusedIndex,
    icons,
    items: newItems,
    maxLineY,
    visibleExplorerItems,
  }
}
