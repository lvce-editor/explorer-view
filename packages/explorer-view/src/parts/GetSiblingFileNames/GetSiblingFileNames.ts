import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getSiblingFileNames = (items: readonly ExplorerItem[], focusedIndex: number, root: string, pathSeparator: string): readonly string[] => {
  if (focusedIndex < 0 || focusedIndex >= items.length) {
    // If no focused item or invalid index, get root level items
    return items.filter((item) => item.depth === 0).map((item) => item.name)
  }

  const focusedItem = items[focusedIndex]
  const focusedItemParentPath = focusedItem.path.slice(0, -(focusedItem.name.length + 1))

  // Find all items that are direct children of the same parent as the focused item
  const siblingItems = items.filter((item) => {
    const itemParentPath = item.path.slice(0, -(item.name.length + 1))
    return itemParentPath === focusedItemParentPath
  })

  return siblingItems.map((item) => item.name)
}
