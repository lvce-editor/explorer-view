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
    newState.icons,
    newState.useChevrons,
  )
  const isWide = newState.width > 450
  const dom = GetExplorerVirtualDom.getExplorerVirtualDom(visibleDirents, newState.focusedIndex, newState.root, isWide, newState.focused)
  return ['Viewlet.setDom2', dom]
}
