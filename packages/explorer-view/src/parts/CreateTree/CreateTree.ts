import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeItem } from '../TreeItem/TreeItem.ts'
import * as Path from '../Path/Path.ts'

export const createTree = (items: readonly ExplorerItem[], root: string): Tree => {
  const tree: Record<string, TreeItem[]> = Object.create(null)
  const rootLength = root.length
  for (const item of items) {
    const relativePath = item.path.slice(rootLength)
    const dirname = Path.dirname2(relativePath)
    tree[dirname] ||= []
    tree[dirname].push({
      name: item.name,
      type: item.type,
    })
  }
  return tree
}
