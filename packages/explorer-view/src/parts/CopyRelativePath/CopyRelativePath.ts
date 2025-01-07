import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const copyRelativePath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  const relativePath = dirent.path.slice(1)
  // TODO handle error
  await ClipBoard.writeText(relativePath)
  return state
}
