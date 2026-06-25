import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { FileOperation } from '../FileOperation/FileOperation.ts'

export const pushUndoStack = (state: ExplorerState, operations: readonly FileOperation[]): ExplorerState => {
  if (operations.length === 0) {
    return state
  }
  return {
    ...state,
    undoStack: [...state.undoStack, operations],
  }
}
