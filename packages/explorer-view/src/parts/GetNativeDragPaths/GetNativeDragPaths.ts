import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDraggedItems } from '../GetDraggedItems/GetDraggedItems.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const windowsPath = /^[a-z]:[\\/]/i
const isLocalPath = (path: string): boolean => path.startsWith('/') || path.startsWith('file://') || windowsPath.test(path)

export const getNativeDragPaths = (state: ExplorerState): readonly string[] => {
  const { platform } = state
  if (platform !== PlatformType.Electron) {
    return []
  }
  const paths = getDraggedItems(state).map((item) => item.path)
  return paths.every(isLocalPath) ? paths : []
}
