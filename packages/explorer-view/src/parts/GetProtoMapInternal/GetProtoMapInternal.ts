import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'

export const getProtoMapInternal = (root: string, pathToDirents: Record<string, readonly RawDirent[]>, depth: number): readonly ExplorerItem[] => {
  if (!(root in pathToDirents)) {
    return []
  }
  const items = pathToDirents[root] || []
  const protoMap: ExplorerItem[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const path = `${root}/${item.name}`
    const displayDirent: ExplorerItem = {
      name: item.name,
      posInSet: i + 1,
      setSize: items.length,
      depth,
      type: item.type,
      path,
      icon: '',
      selected: false,
    }
    const children = getProtoMapInternal(path, pathToDirents, depth + 1)
    protoMap.push(displayDirent, ...children)
  }
  return protoMap
}
