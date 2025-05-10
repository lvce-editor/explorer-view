import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as Path from '../Path/Path.ts'

export const createTree = (items: readonly ExplorerItem[]) => {
  const tree: Record<string, ExplorerItem[]> = Object.create(null)
  for (const item of items) {
    const dirname = Path.dirname('/', item.path)
    tree[dirname] ||= []
    tree[dirname].push(item)
  }
  return tree
}
