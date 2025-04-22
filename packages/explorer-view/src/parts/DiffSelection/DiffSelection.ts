import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderSelection

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.editingSelection.start === newState.editingSelection.start && oldState.editingSelection.end === newState.editingSelection.end
}
