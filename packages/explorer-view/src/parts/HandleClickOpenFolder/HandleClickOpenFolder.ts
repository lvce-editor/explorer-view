import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as OpenFolder from '../OpenFolder/OpenFolder.ts'

export const handleClickOpenFolder = async (state: ExplorerState): Promise<ExplorerState> => {
  await OpenFolder.openFolder()
  return state
}
