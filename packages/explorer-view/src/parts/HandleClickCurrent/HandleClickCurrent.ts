import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'

export const handleClickCurrent = (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, minLineY } = state
  return HandleClick.handleClick(state, focusedIndex - minLineY, /* keepFocus */ false)
}
