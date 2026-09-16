import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'

export const handleClickCurrentButKeepFocus = (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex } = state
  return HandleClick.handleClick(state, focusedIndex, /* keepFocus */ true)
}
