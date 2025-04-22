import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { Renderer } from '../Renderer/Renderer.ts'

export const renderEditingSelection: Renderer = (oldState: ExplorerState, newState: ExplorerState): any => {
  return ['Viewlet.setSelection', newState.editingSelection]
}
