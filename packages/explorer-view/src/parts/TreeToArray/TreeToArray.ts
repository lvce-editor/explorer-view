import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const treeToArray = (map: Record<string, readonly ExplorerItem[]>, root: string) => {
  const items: ExplorerItem[] = []
  let children = map[root]
  const itemMap: Record<string, ExplorerItem[]> = Object.create(null)
  return itemMap
}
