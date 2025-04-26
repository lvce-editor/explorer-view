import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as RemovePaths from '../RemovePaths/RemovePaths.ts'

export const removeDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  const { items, focusedIndex } = state
  const selectedItems = getSelectedItems(items, focusedIndex)
  if (selectedItems.length === 0) {
    return state
  }
  const toRemove = getPaths(selectedItems)
  await RemovePaths.removePaths(toRemove)
  const newState = await Refresh.refresh(state)
  return newState
}
