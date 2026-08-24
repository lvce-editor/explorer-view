import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const focus = (state: ExplorerState): ExplorerState => {
  const { focus } = state
  if (focus) {
    return state
  }
  return {
    ...state,
    focus: FocusId.List,
  }
}
