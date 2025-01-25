import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handleClickAt = (state: ExplorerState, button: number, x: number, y: number): any => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
  return HandleClick.handleClick(state, index)
}
