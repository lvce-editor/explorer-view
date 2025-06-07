import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as GetEditingType from '../GetEditingType/GetEditingType.ts'

export const getNewDirentsForRename = (items: readonly ExplorerItem[], focusedIndex: number): readonly ExplorerItem[] => {
  const item = items[focusedIndex]
  const newItems = [...items]
  const editingType = GetEditingType.getEditingType(item.type)
  // TODO avoid mutation
  newItems[focusedIndex] = {
    ...item,
    type: editingType,
  }
  return newItems
}
