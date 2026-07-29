import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusNone from '../FocusNone/FocusNone.ts'

export const handleEscape = async (state: ExplorerState): Promise<ExplorerState> => {
  return {
    ...FocusNone.focusNone(state),
    cutItems: [],
  }
}
