import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const copyPath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }
  // TODO windows paths
  // TODO handle error
  const { path } = dirent
  await RendererWorker.writeClipBoardText(path)
  return state
}
