import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIncremental = (oldState: ExplorerState, newState: ExplorerState): any => {
  const oldDom = renderItems(oldState, oldState)[1]
  const newDom = renderItems(newState, newState)[1]
  const patches = diffTree(oldDom, newDom)
  console.log({ patches })
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
