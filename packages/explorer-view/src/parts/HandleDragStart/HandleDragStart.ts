import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDraggedItems } from '../GetDraggedItems/GetDraggedItems.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

const isLocalPath = (path: string): boolean => path.startsWith('/') || path.startsWith('file://') || /^[a-z]:[\\/]/i.test(path)

export const handleDragStart = async (state: ExplorerState): Promise<ExplorerState> => {
  if (state.platform !== PlatformType.Electron) {
    return state
  }
  const paths = getDraggedItems(state).map((item) => item.path)
  if (paths.length > 0 && paths.every(isLocalPath)) {
    await RendererWorker.invoke('ElectronWindow.startDrag', paths)
  }
  return state
}
