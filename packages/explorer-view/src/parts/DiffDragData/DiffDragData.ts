import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderDragData

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return !oldState.isPointerDown && newState.isPointerDown
}
