import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'

export const handleClickCurrentButKeepFocus = (state: ExplorerState): Promise<ExplorerState> => {
  return HandleClick.handleClick(state, state.focusedIndex - state.minLineY, /* keepFocus */ true)
}
