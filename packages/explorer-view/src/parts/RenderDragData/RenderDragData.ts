import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const { items, focusedIndex } = newState
  const selected = items.filter((item, index) => item.selected || index === focusedIndex)
  const urls = selected.map((item) => item.path)
  const data = urls.join('\n')
  // TODO send selected urls
  const dragData = [
    {
      type: 'text/plain',
      data,
    },
  ]
  return ['Viewlet.setDragData', newState.uid, dragData]
}
