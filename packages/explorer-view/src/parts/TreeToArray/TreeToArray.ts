import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import { join2 } from '../Path/Path.ts'

export const treeToArray = (map: Tree, root: string): readonly ExplorerItem[] => {
  const items: ExplorerItem[] = []
  const processChildren = (path: string, depth: number): void => {
    const children = map[path]
    if (!children) {
      return
    }
    const count = children.length
    for (let i = 0; i < count; i++) {
      const child = children[i]
      const childPath = join2(path, child.name)
      const absolutePath = `${root}${childPath}`
      items.push({
        depth,
        posInSet: i + 1,
        setSize: count,
        icon: '',
        path: absolutePath,
        selected: false,
        name: child.name,
        type: child.type,
      })
      processChildren(childPath, depth + 1)
    }
  }
  processChildren('', 0)
  return items
}
