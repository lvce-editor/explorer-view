import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const copyPath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  // @ts-ignore
  const path = dirent.path
  // await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ path)
  return state
}
