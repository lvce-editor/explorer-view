import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as ConfirmDelete from '../ConfirmDelete/ConfirmDelete.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'
import * as Refresh from '../Refresh/Refresh.ts'

export const removeDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  const { items, focusedIndex, confirmDelete } = state
  const selectedItems = getSelectedItems(items, focusedIndex)
  if (selectedItems.length === 0) {
    return state
  }
  const toRemove = getPaths(selectedItems)

  if (confirmDelete) {
    const confirmed = await ConfirmDelete.confirmDelete(toRemove)
    if (!confirmed) {
      return state
    }
  }
  const fileOperations: readonly FileOperation[] = toRemove.map((item) => {
    return {
      type: FileOperationType.Remove,
      path: item,
    }
  })
  // TODO use bulk edit and explorer refresh
  await ApplyFileOperations.applyFileOperations(fileOperations)
  const newState = await Refresh.refresh(state)
  return {
    ...newState,
    focused: true,
    focus: FocusId.List,
  }
}
