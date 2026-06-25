import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import { showErrorAlert } from '../ShowErrorAlert/ShowErrorAlert.ts'

export const undo = async (state: ExplorerState): Promise<ExplorerState> => {
  const { undoStack } = state
  if (undoStack.length === 0) {
    return state
  }
  const operations = undoStack[undoStack.length - 1]
  const errorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (errorMessage) {
    await showErrorAlert(errorMessage)
    return state
  }
  const newState = await Refresh.refresh({
    ...state,
    undoStack: undoStack.slice(0, -1),
  })
  return {
    ...newState,
    focus: FocusId.List,
    focused: true,
  }
}
