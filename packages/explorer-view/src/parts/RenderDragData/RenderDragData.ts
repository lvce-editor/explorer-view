import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDragData } from '../GetDragData/GetDragData.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { items, pointerDownIndex } = newState
  const selected = items.filter((item, index) => item.selected || index === pointerDownIndex)
  const urls = selected.map((item) => item.path)
  const dragData = getDragData(urls)
  return ['Viewlet.setDragData', newState.uid, dragData]
}
