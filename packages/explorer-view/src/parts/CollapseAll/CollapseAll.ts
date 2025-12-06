import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getFocusedIndexCancel } from '../GetFocusedIndexCancel/GetFocusedIndexCancel.ts'
import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items } = state
  const newDirents = items.filter(IsTopLevel.isTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  const newFocusedIndex = getFocusedIndexCancel(newDirents, focusedIndex)
  return {
    ...state,
    focusedIndex: newFocusedIndex,
    items: newDirents,
  }
}
