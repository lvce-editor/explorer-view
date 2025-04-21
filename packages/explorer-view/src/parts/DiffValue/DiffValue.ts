import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const diffType = DiffType.RenderValue

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.focus === FocusId.Input && newState.focus === FocusId.Input && oldState.editingValue === newState.editingValue
}
