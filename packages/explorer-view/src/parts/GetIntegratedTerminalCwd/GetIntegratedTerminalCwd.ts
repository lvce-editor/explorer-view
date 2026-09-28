import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Path from '../Path/Path.ts'

const directoryTypes = new Set([DirentType.Directory, DirentType.DirectoryExpanded, DirentType.DirectoryExpanding, DirentType.SymLinkFolder])

export const getIntegratedTerminalCwd = (state: ExplorerState): string => {
  const { focusedIndex, items, pathSeparator, root } = state
  if (focusedIndex < 0 || focusedIndex >= items.length) {
    return root
  }
  const item = items[focusedIndex]
  if (directoryTypes.has(item.type)) {
    return item.uri
  }
  return Path.dirname(pathSeparator, item.uri)
}
