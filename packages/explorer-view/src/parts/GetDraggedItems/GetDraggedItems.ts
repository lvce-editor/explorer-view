import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

export const getDraggedItems = (state: ExplorerState): readonly ExplorerItem[] => {
  const { focusedIndex, items, pointerDownIndex } = state
  const pointerDownItem = items[pointerDownIndex]
  if (pointerDownIndex === focusedIndex || pointerDownItem?.selected) {
    return getSelectedItems(items, focusedIndex)
  }
  return pointerDownItem ? [pointerDownItem] : []
}
