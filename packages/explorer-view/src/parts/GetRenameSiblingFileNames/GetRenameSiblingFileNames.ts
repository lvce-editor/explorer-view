import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { dirname } from '../Path/Path.ts'

export const getRenameSiblingFileNames = (items: readonly ExplorerItem[], editingIndex: number, pathSeparator: string): readonly string[] => {
  const editingItem = items[editingIndex]
  if (!editingItem) {
    return []
  }
  const parentPath = dirname(pathSeparator, editingItem.path)
  return items.filter((item, index) => index !== editingIndex && dirname(pathSeparator, item.path) === parentPath).map((item) => item.name)
}
