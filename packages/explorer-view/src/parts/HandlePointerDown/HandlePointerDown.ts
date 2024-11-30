import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'

export const handlePointerDown = (state: any, button: number, x: number, y: number): any => {
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
