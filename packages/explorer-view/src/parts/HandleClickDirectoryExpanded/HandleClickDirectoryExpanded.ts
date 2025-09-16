import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const handleClickDirectoryExpanded = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  keepFocus: boolean,
): Promise<ExplorerState> => {
  const {
    minLineY,
    maxLineY,
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
    useChevrons,
    items,
  } = state
  // @ts-ignore
  dirent.type = DirentType.Directory
  // @ts-ignore
  dirent.icon = ''
  const endIndex = GetParentEndIndex.getParentEndIndex(items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...items]
  newDirents.splice(index + 1, removeCount)
  const newTotal = newDirents.length
  if (newTotal < maxLineY) {
    const visibleItems = Math.min(maxLineY - minLineY, newTotal)
    const newMaxLineY = Math.min(maxLineY, newTotal)
    const newMinLineY = newMaxLineY - visibleItems
    const deltaY = newMinLineY * itemHeight
    const parts = newDirents.slice(newMinLineY, newMaxLineY)
    const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(parts, fileIconCache)
    const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
      newDirents,
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
      deltaY,
      fileIconCache: newFileIconCache,
      focused: keepFocus,
      focusedIndex: index,
      icons,
      items: newDirents,
      maxLineY: newMaxLineY,
      minLineY: newMinLineY,
      visibleExplorerItems,
    }
  }
  return {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
    items: newDirents,
  }
}
