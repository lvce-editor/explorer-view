import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handlePasteNone = async (state: ExplorerState, nativeFiles: any): Promise<ExplorerState> => {
  console.error('[ViewletExplorer/handlePaste] no paths detected')
  return state
}
