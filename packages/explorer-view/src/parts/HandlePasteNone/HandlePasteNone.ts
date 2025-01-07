import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export const handlePasteNone = async (state: ExplorerState, nativeFiles: any): Promise<ExplorerState> => {
  console.info('[ViewletExplorer/handlePaste] no paths detected')
  return state
}
