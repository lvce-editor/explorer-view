import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData } from '../GetDragData/GetDragData.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

const getDraggedItems = (state: ExplorerState): readonly ExplorerItem[] => {
  const { focusedIndex, items, pointerDownIndex } = state
  const pointerDownItem = items[pointerDownIndex]
  if (pointerDownIndex === focusedIndex || pointerDownItem?.selected) {
    return getSelectedItems(items, focusedIndex)
  }
  if (pointerDownItem) {
    return [pointerDownItem]
  }
  return []
}

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { isPointerDown, uid } = newState
  if (!isPointerDown) {
    return []
  }
  const draggedItems = getDraggedItems(newState)
  const urls = draggedItems.map((item) => item.path)
  const dragData = getDragData(urls)
  return ['Viewlet.setDragData', uid, dragData]
}
