import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleScrollBarCaptureLost = (state: ExplorerState): ExplorerState => {
  return {
    ...state,
    scrollBarActive: false,
  }
}
