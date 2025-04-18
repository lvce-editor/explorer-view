import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const copyPath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }
  // TODO windows paths
  // TODO handle error
  // @ts-ignore
  const { path } = dirent
  // await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ path)
  return state
}
