import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Path from '../Path/Path.ts'

export const getTitle = (state: ExplorerState): string => {
  const { pathSeparator, root } = state
  if (!root) {
    return 'Explorer'
  }
  const normalizedRoot = root.endsWith(pathSeparator) && root !== pathSeparator ? root.slice(0, -pathSeparator.length) : root
  return Path.getBaseName(pathSeparator, normalizedRoot) || normalizedRoot
}
