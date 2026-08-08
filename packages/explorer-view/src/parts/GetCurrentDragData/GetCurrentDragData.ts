import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData, type IDragInfoNew } from '../GetDragData/GetDragData.ts'
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

export const getCurrentDragData = (state: ExplorerState): IDragInfoNew => {
  const draggedItems = getDraggedItems(state)
  const urls = draggedItems.map((item) => item.path)
  return getDragData(urls)
}
