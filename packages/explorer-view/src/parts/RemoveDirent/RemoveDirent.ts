import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as RemovePaths from '../RemovePaths/RemovePaths.ts'

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  if (state.focusedIndex < 0) {
    return state
  }
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }

  // Get all selected items including the focused one
  const selectedItems = state.items.filter((item) => item.selected || item === dirent)
  if (selectedItems.length === 0) {
    return state
  }

  const toRemove = selectedItems.map((item) => item.path)
  await RemovePaths.removePaths(toRemove)
  const newState = await Refresh.refresh(state)
  return {
    ...newState,
    focusedIndex: -1,
  }
}
