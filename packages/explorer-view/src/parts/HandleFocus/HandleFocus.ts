import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  const { pendingFocusedIndex } = state
  if (pendingFocusedIndex !== -1) {
    return {
      ...state,
      focus: FocusId.List,
      focused: true,
      focusedIndex: pendingFocusedIndex,
      pendingFocusedIndex: -1,
    }
  }
  return {
    ...state,
    focus: FocusId.List,
    focused: true,
  }
}
