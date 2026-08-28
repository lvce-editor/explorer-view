import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const focus = (state: ExplorerState): ExplorerState => {
  const { editingIndex, focus, focusGeneration } = state
  if (editingIndex !== -1) {
    return state
  }
  return {
    ...state,
    focus: focus || FocusId.List,
    focused: true,
    focusGeneration: focusGeneration + 1,
  }
}
