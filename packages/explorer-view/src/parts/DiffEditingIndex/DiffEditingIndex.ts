import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderEditingIndex

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.editingIndex === newState.editingIndex && oldState.editingType === newState.editingType
}
