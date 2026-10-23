import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIncremental = (oldState: ExplorerState, newState: ExplorerState): any => {
  // A full render disconnects the scrollbar and loses native pointer capture.
  const rowCountChanged = oldState.visibleExplorerItems.length !== newState.visibleExplorerItems.length
  if (oldState.initial || (rowCountChanged && !newState.scrollBarActive)) {
    return renderItems(oldState, newState)
  }
  const oldDom = renderItems(oldState, oldState)[2]
  const newDom = renderItems(newState, newState)[2]
  const patches = diffTree(oldDom, newDom)
  return ['Viewlet.setTreePatches', newState.uid, patches]
}
