import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const setDeltaY = async (state: ExplorerState, deltaY: number): Promise<ExplorerState> => {
  const {
    itemHeight,
    useChevrons,
    height,
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
  } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
  const visible = items.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, state.fileIconCache)
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
    deltaY,
    fileIconCache: newFileIconCache,
    icons,
    maxLineY,
    minLineY,
    visibleExplorerItems,
  }
}
