import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export interface WrappedFn {
  (uid: number, ...args: readonly any[]): Promise<void>
}

export interface Fn {
  (state: ExplorerState, ...args: readonly any[]): ExplorerState | Promise<ExplorerState>
}
