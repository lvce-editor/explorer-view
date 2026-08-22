import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'
import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex } = state
  const stateWithoutEdit = editingIndex === -1 ? state : await cancelEditInternal(state, true)
  const { items } = stateWithoutEdit
  const newDirents = items.filter(IsTopLevel.isTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  return {
    ...stateWithoutEdit,
    expandedPaths: [],
    focusedIndex: 0,
    items: newDirents,
  }
}
