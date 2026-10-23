import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'

export const handlePasteNone = (state: ExplorerState, _nativeFiles: NativeFilesResult): Promise<ExplorerState> => {
  console.error('[ViewletExplorer/handlePaste] no paths detected')
  return Promise.resolve(state)
}
