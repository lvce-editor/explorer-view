import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export interface ClickHandler {
  (state: ExplorerState, dirent: any, index: number, keepFocus: boolean): Promise<any>
}
