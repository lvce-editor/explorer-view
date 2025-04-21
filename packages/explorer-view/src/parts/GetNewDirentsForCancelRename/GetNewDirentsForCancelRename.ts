import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { DELTA_EDITING } from '../DeltaEditing/DeltaEditing.ts'

export const getNewDirentsForCancelRename = (items: readonly ExplorerItem[], editingIndex: number): readonly ExplorerItem[] => {
  const item = items[editingIndex]
  const newItems = [...items]
  newItems[editingIndex] = {
    ...item,
    type: item.type - DELTA_EDITING,
  }
  return newItems
}
