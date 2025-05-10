import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const treeToArray = (map: Record<string, readonly ExplorerItem[]>, root: string): readonly ExplorerItem[] => {
  const items: ExplorerItem[] = []
  const processChildren = (path: string, depth: number) => {
    const children = map[path]
    if (!children) {
      return
    }
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      items.push({
        ...child,
        depth,
        posInSet: i + 1,
        setSize: children.length,
      })
      processChildren(child.path, depth + 1)
    }
  }
  processChildren(root, 0)
  return items
}
