import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { dirname } from '../Path/Path.ts'

export const getSiblingFileNames = (items: readonly ExplorerItem[], focusedIndex: number, root: string, pathSeparator: string): readonly string[] => {
  if (focusedIndex < 0 || focusedIndex >= items.length) {
    // If no focused item or invalid index, get root level items
    return items.filter((item) => item.depth === 0).map((item) => item.name)
  }

  const focusedItem = items[focusedIndex]
  // Creation placeholders store the target directory itself as their path.
  const parentPath = focusedItem.name ? dirname(pathSeparator, focusedItem.path) : focusedItem.path
  const siblingItems = items.filter((item) => item.name !== '' && dirname(pathSeparator, item.path) === parentPath)

  return siblingItems.map((item) => item.name)
}
