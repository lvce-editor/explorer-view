import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handleClickAt = (
  state: ExplorerState,
  button: number,
  ctrlKey: boolean,
  shiftKey: boolean,
  x: number,
  y: number,
): ExplorerState | Promise<ExplorerState> => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
  return HandleClick.handleClick(state, index)
}
