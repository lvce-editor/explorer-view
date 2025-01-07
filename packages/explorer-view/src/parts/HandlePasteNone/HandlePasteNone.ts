import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export const handlePasteNone = (state: ExplorerState, nativeFiles: any): ExplorerState => {
  console.info('[ViewletExplorer/handlePaste] no paths detected')
  return state
}
