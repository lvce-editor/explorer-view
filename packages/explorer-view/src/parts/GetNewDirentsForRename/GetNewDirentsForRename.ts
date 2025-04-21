import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getNewDirentsForRename = (items: readonly ExplorerItem[], focusedIndex: number): readonly ExplorerItem[] => {
  const item = items[focusedIndex]
  const newItems = [...items]
  const editingType = item.type === DirentType.File ? DirentType.EditingFile : DirentType.EditingFolder
  newItems[focusedIndex] = {
    ...item,
    type: editingType,
  }
  return newItems
}
