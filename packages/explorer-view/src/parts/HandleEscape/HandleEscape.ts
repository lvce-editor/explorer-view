import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusNone from '../FocusNone/FocusNone.ts'

export const handleEscape = (state: ExplorerState): Promise<ExplorerState> => {
  return Promise.resolve({
    ...FocusNone.focusNone(state),
    cutItems: [],
  })
}
