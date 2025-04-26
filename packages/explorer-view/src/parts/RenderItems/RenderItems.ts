import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const renderItems = (oldState: ExplorerState, newState: ExplorerState): any => {
  const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
    newState.items,
    newState.minLineY,
    newState.maxLineY,
    newState.focusedIndex,
    newState.editingIndex,
    newState.editingType,
    newState.editingValue,
    newState.editingErrorMessage,
    newState.icons,
    newState.useChevrons,
    newState.dropTargets,
    newState.editingIcon,
  )
  const isWide = newState.width > 450
  const contentHeight = newState.items.length * newState.itemHeight
  const dom = GetExplorerVirtualDom.getExplorerVirtualDom(
    visibleDirents,
    newState.focusedIndex,
    newState.root,
    isWide,
    newState.focused,
    newState.dropTargets,
    newState.height,
    contentHeight,
    newState.deltaY,
  )
  return ['Viewlet.setDom2', dom]
}
