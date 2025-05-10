import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as Path from '../Path/Path.ts'

export const createRenameMap = (
  items: readonly ExplorerItem[],
  parentPath: string,
  newItems: readonly ExplorerItem[],
): Record<string, readonly ExplorerItem[]> => {
  const itemMap: Record<string, ExplorerItem[]> = Object.create(null)
  for (const item of items) {
    const dirname = Path.dirname('/', item.path)
    if (dirname === parentPath) {
      continue
    }
    itemMap[dirname] ||= []
    itemMap[dirname].push(item)
  }
  for (const item of newItems) {
    const dirname = Path.dirname('/', item.path)
    itemMap[dirname] ||= []
    itemMap[dirname].push(item)
  }
  return itemMap
}
