import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleDragLeave = (state: ExplorerState): ExplorerState => {
  const { dropTargets } = state
  if (dropTargets.length === 0) {
    return state
  }
  return {
    ...state,
    dropTargets: [],
  }
}
