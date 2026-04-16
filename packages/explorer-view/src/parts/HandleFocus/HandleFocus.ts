import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  console.log('handleFocus', { focused: state.focused, focusedIndex: state.focusedIndex })
  return {
    ...state,
    focus: FocusId.List,
  }
}
