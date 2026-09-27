import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Path from '../Path/Path.ts'

export const getTitle = (state: ExplorerState): string => {
  const { pathSeparator, root } = state
  if (!root) {
    return 'Explorer'
  }
  const isUri = URL.canParse(root)
  const url = isUri ? new URL(root) : undefined
  const titlePath = url?.pathname ?? root
  const titlePathSeparator = isUri ? '/' : pathSeparator
  const normalizedTitlePath =
    titlePath.endsWith(titlePathSeparator) && titlePath !== titlePathSeparator ? titlePath.slice(0, -titlePathSeparator.length) : titlePath
  const title = Path.getBaseName(titlePathSeparator, normalizedTitlePath) || normalizedTitlePath
  const decodedTitle = decodeURIComponent(title)
  if (url?.protocol !== 'remote-ssh:' || !url.hostname) {
    return decodedTitle
  }
  const remoteSuffix = `[SSH: ${url.hostname}]`
  return decodedTitle ? `${decodedTitle} ${remoteSuffix}` : remoteSuffix
}
