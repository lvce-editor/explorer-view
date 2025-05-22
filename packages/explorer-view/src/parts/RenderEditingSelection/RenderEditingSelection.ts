import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { Renderer } from '../Renderer/Renderer.ts'
import * as InputName from '../InputName/InputName.ts'

export const renderEditingSelection: Renderer = (oldState: ExplorerState, newState: ExplorerState): any => {
  const { editingSelectionStart, editingSelectionEnd } = newState
  return ['Viewlet.setSelectionByName', InputName.ExplorerInput, editingSelectionStart, editingSelectionEnd]
}
