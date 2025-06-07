import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderSelection

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.editingSelectionStart === newState.editingSelectionStart && oldState.editingSelectionEnd === newState.editingSelectionEnd
}
