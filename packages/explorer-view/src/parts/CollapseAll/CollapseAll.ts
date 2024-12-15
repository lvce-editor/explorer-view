import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = (state: any): any => {
  const { items } = state
  const newDirents = items.filter(IsTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  return {
    ...state,
    items: newDirents,
  }
}
