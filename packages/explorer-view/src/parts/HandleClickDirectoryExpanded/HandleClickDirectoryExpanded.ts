import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'

export const handleClickDirectoryExpanded = async (state: ExplorerState, dirent: any, index: any, keepFocus: boolean): Promise<Promise<any>> => {
  const { minLineY, maxLineY, itemHeight } = state
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = GetParentEndIndex.getParentEndIndex(state.items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...state.items]
  newDirents.splice(index + 1, removeCount)
  const newTotal = newDirents.length
  if (newTotal < maxLineY) {
    const visibleItems = Math.min(maxLineY - minLineY, newTotal)
    const newMaxLineY = Math.min(maxLineY, newTotal)
    const newMinLineY = newMaxLineY - visibleItems
    const deltaY = newMinLineY * itemHeight
    const parts = newDirents.slice(minLineY, maxLineY)
    const icons = await GetFileIcons.getFileIcons(parts)
    return {
      ...state,
      items: newDirents,
      icons,
      focusedIndex: index,
      focused: keepFocus,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY,
    }
  }
  const parts = newDirents.slice(state.minLineY, state.maxLineY)
  const icons = await GetFileIcons.getFileIcons(parts)
  return {
    ...state,
    items: newDirents,
    icons,
    focusedIndex: index,
    focused: keepFocus,
  }
}
