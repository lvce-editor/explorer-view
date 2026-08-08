import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData } from '../GetDragData/GetDragData.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { focusedIndex, isPointerDown, items, pointerDownIndex, uid } = newState
  if (!isPointerDown) {
    return []
  }
  const pointerDownItem = items[pointerDownIndex]
  let draggedItems
  if (pointerDownIndex === focusedIndex || pointerDownItem?.selected) {
    draggedItems = getSelectedItems(items, focusedIndex)
  } else if (pointerDownItem) {
    draggedItems = [pointerDownItem]
  } else {
    draggedItems = []
  }
  const dragData = getDragData(draggedItems.map((item) => item.path))
  return ['Viewlet.setDragData', uid, dragData]
}
