import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getNativeDragPaths } from '../GetNativeDragPaths/GetNativeDragPaths.ts'

export const handleDragStart = async (state: ExplorerState): Promise<ExplorerState> => {
  const paths = getNativeDragPaths(state)
  if (paths.length > 0) {
    await RendererWorker.invoke('ElectronWindow.startDrag', paths)
  }
  return state
}
