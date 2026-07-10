import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import { isExcluded } from '../IsExcluded/IsExcluded.ts'
import { join2 } from '../Path/Path.ts'
import { restoreDirentType } from '../RestoreDirentType/RestoreDirentType.ts'

export const getProtoMapInternal = (
  root: string,
  pathToDirents: Record<string, readonly RawDirent[]>,
  expandedPaths: readonly string[],
  depth: number,
  excluded: readonly string[] = [],
  workspaceRoot: string = root,
): readonly ExplorerItem[] => {
  if (!(root in pathToDirents)) {
    return []
  }
  const items = (pathToDirents[root] || []).filter((item) => !isExcluded(workspaceRoot, join2(root, item.name), excluded))
  const protoMap: ExplorerItem[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const path = join2(root, item.name)
    const displayDirent: ExplorerItem = {
      depth,
      icon: '',
      name: item.name,
      path,
      posInSet: i + 1,
      selected: false,
      setSize: items.length,
      type: restoreDirentType(item.type, path, expandedPaths),
    }
    const children = getProtoMapInternal(path, pathToDirents, expandedPaths, depth + 1, excluded, workspaceRoot)
    protoMap.push(displayDirent, ...children)
  }
  return protoMap
}
