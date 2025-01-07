import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = (state: ExplorerState): ExplorerState => {
  const { items } = state
  const newDirents = items.filter(IsTopLevel.isTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  return {
    ...state,
    items: newDirents,
  }
}
