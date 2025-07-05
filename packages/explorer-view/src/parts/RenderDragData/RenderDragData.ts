import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const renderDragData = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  // TODO send selected urls
  const dragData = [
    {
      type: 'text/plain',
      data: 'https://example.com',
    },
  ]
  return ['Viewlet.setDragData', newState.uid, dragData]
}
