import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { getNewChildDirentsForNewDirent } from '../GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'

export const getNewDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  focusedIndex: number,
  type: number,
): Promise<readonly ExplorerItem[]> => {
  if (items.length === 0 || focusedIndex === -1) {
    const newDirent: ExplorerItem = {
      name: '',
      type,
      path: '',
      depth: 0,
      selected: false,
      posInSet: 1,
      setSize: 1,
      icon: '',
    }
    return [...items, newDirent]
  }

  const focusedItem = items[focusedIndex]
  if (!focusedItem) {
    return items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  const updatedChildren = await getNewChildDirentsForNewDirent(items, depth, parentPath, type)

  // Create new array with updated items
  const parentIndex = focusedIndex
  const itemsBeforeParent = items.slice(0, parentIndex)
  const itemsAfterChildren = items.slice(parentIndex + updatedChildren.length)

  const updatedParent = {
    ...items[parentIndex],
    setSize: (items[parentIndex]?.setSize || 0) + 1,
  }

  return [...itemsBeforeParent, updatedParent, ...updatedChildren, ...itemsAfterChildren]
}
