import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  console.log('handleFocus', { focusedIndex: state.focusedIndex, focused: state.focused })
  return {
    ...state,
    focus: FocusId.List,
  }
}
