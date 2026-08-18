import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { normalizeDirentType } from '../NormalizeDirentType/NormalizeDirentType.ts'

export const syncExpandedPaths = (state: ExplorerState): ExplorerState => {
  const { expandedPaths: oldExpandedPaths, items, preserveExpandState } = state
  if (!preserveExpandState) {
    return state
  }
  const expandedPaths = new Set(oldExpandedPaths)
  for (const item of items) {
    const type = normalizeDirentType(item.type)
    if (type === DirentType.DirectoryExpanded || type === DirentType.DirectoryExpanding) {
      expandedPaths.add(item.path)
    } else if (type === DirentType.Directory || type === DirentType.SymLinkFolder) {
      expandedPaths.delete(item.path)
    }
  }
  const newExpandedPaths = [...expandedPaths]
  if (newExpandedPaths.length === oldExpandedPaths.length && newExpandedPaths.every((path, index) => path === oldExpandedPaths[index])) {
    return state
  }
  return {
    ...state,
    expandedPaths: newExpandedPaths,
  }
}
