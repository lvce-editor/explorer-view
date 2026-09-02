import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
export interface DropHandler {
  (state: ExplorerState, fileHandles: readonly FileSystemHandle[], paths: readonly string[], index: number): Promise<ExplorerState>
}
