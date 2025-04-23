import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleClickAtRangeSelection from '../HandleClickAtRangeSelection/HandleClickAtRangeSelection.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handleClickAt = async (
  state: ExplorerState,
  defaultPrevented: boolean,
  button: number,
  ctrlKey: boolean,
  shiftKey: boolean,
  x: number,
  y: number,
): Promise<ExplorerState> => {
  if (defaultPrevented) {
    return state
  }
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)

  if (shiftKey) {
    return HandleClickAtRangeSelection.handleClickAtRangeSelection(state, index)
  }

  return HandleClick.handleClick(state, index)
}
