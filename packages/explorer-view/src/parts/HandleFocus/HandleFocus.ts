import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  return {
    ...state,
    focus: FocusId.List,
  }
}
