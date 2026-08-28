import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const focus = (state: ExplorerState): ExplorerState => {
  const { focus, focused } = state
  if (focus && focused) {
    return state
  }
  return {
    ...state,
    focus: focus || FocusId.List,
    focused: true,
  }
}
