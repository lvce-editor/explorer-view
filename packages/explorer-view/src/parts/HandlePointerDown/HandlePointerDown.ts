import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handlePointerDown = (state: ExplorerState, button: number, x: number, y: number): ExplorerState => {
  const index = getIndexFromPosition(state, x, y)
  if (button === MouseEventType.LeftClick && index === -1) {
    return {
      ...state,
      focused: true,
      focusedIndex: -1,
    }
  }
  return state
}
