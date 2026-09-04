import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Path from '../Path/Path.ts'

export const getTitle = (state: ExplorerState): string => {
  const { pathSeparator, root } = state
  if (!root) {
    return 'Explorer'
  }
  const isUri = URL.canParse(root)
  const titlePath = isUri ? new URL(root).pathname : root
  const titlePathSeparator = isUri ? '/' : pathSeparator
  const normalizedTitlePath =
    titlePath.endsWith(titlePathSeparator) && titlePath !== titlePathSeparator ? titlePath.slice(0, -titlePathSeparator.length) : titlePath
  const title = Path.getBaseName(titlePathSeparator, normalizedTitlePath) || normalizedTitlePath
  return decodeURIComponent(title)
}
