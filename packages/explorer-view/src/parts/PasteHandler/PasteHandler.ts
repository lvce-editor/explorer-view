import { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export interface PasteHandler {
  (state: ExplorerState, nativeFiles: any): Promise<ExplorerState>
}
