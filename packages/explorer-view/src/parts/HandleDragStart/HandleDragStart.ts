import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDraggedItems } from '../GetDraggedItems/GetDraggedItems.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const windowsPath = /^[a-z]:[\\/]/i

const isLocalPath = (path: string): boolean => path.startsWith('/') || path.startsWith('file://') || windowsPath.test(path)

export const handleDragStart = async (state: ExplorerState): Promise<ExplorerState> => {
  const { platform } = state
  if (platform !== PlatformType.Electron) {
    return state
  }
  const paths = getDraggedItems(state).map((item) => item.path)
  if (paths.length > 0 && paths.every(isLocalPath)) {
    await RendererWorker.invoke('ElectronWindow.startDrag', paths)
  }
  return state
}
