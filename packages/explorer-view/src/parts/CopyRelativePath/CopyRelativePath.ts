import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const copyRelativePath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }
  const relativePath = dirent.path.slice(1)
  // TODO handle error
  await ClipBoard.writeText(relativePath)
  return state
}
