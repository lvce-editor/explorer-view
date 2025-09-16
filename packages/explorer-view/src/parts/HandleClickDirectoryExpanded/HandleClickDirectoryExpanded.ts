import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'

export const handleClickDirectoryExpanded = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  keepFocus: boolean,
): Promise<ExplorerState> => {
  const { minLineY, maxLineY, itemHeight, fileIconCache, items } = state
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
    return {
      ...state,
      items: newDirents,
      icons,
      fileIconCache: newFileIconCache,
      focusedIndex: index,
      focused: keepFocus,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY,
    }
  }
  const parts = newDirents.slice(state.minLineY, state.maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(parts, fileIconCache)
  return {
    ...state,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
    focusedIndex: index,
    focused: keepFocus,
  }
}
