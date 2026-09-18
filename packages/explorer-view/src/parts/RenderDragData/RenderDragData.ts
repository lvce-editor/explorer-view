import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData } from '../GetDragData/GetDragData.ts'
import { getDraggedItems } from '../GetDraggedItems/GetDraggedItems.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { isPointerDown, uid } = newState
  if (!isPointerDown) {
    return []
  }
  const dragData = getDragData(getDraggedItems(newState))
  return ['Viewlet.setDragData', uid, dragData]
}
