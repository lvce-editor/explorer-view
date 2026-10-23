import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleFocus = (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex } = state
  if (editingIndex !== -1) {
    return Promise.resolve(state)
  }
  return Promise.resolve({
    ...state,
    focus: FocusId.List,
  })
}
