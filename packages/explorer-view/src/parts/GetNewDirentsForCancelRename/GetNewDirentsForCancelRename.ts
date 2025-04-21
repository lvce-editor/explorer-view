import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getNewDirentsForCancelRename = (items: readonly ExplorerItem[], editingIndex: number): readonly ExplorerItem[] => {
  const item = items[editingIndex]
  const newItems = [...items]
  const originalType = item.type === DirentType.EditingFile ? DirentType.File : DirentType.Directory
  newItems[editingIndex] = {
    ...item,
    type: originalType,
  }
  return newItems
}
