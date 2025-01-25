import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export interface PasteHandler {
  (state: ExplorerState, nativeFiles: any): Promise<ExplorerState>
}
