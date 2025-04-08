import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderFocus

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.focused === newState.focused
}
