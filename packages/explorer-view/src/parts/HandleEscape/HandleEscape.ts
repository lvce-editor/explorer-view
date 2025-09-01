import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleEscape = async (state: ExplorerState): Promise<ExplorerState> => {
  // TODO cancel cut highlights
  return {
    ...state,
  }
}
