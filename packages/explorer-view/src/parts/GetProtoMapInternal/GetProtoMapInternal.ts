import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const restoreDirentType = (rawDirentType: number, path: string, expandedPaths: readonly string[]): number => {
  if (rawDirentType === DirentType.Directory && expandedPaths.includes(path)) {
    return DirentType.DirectoryExpanded
  }
  return rawDirentType
}

export const getProtoMapInternal = (
  root: string,
  pathToDirents: Record<string, readonly RawDirent[]>,
  expandedPaths: readonly string[],
  depth: number,
): readonly ExplorerItem[] => {
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
      type: restoreDirentType(item.type, path, expandedPaths),
      path,
      icon: '',
      selected: false,
    }
    const children = getProtoMapInternal(path, pathToDirents, expandedPaths, depth + 1)
    protoMap.push(displayDirent, ...children)
  }
  return protoMap
}
