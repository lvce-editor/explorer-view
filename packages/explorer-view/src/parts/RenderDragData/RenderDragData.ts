import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getCurrentDragData } from '../GetCurrentDragData/GetCurrentDragData.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { isPointerDown, uid } = newState
  if (!isPointerDown) {
    return []
  }
  const dragData = getCurrentDragData(newState)
  return ['Viewlet.setDragData', uid, dragData]
}
