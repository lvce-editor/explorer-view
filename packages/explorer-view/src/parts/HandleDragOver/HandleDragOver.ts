import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as GetNewDropTargets from '../GetNewDropTargets/GetNewDropTargets.ts'
import * as IsEqual from '../IsEqual/IsEqual.ts'

export const handleDragOver = (state: ExplorerState, x: number, y: number): ExplorerState => {
  Assert.number(x)
  Assert.number(y)
  const { dropTargets } = state
  const newDropTargets = GetNewDropTargets.getNewDropTargets(state, x, y)
  console.log({ dropTargets, newDropTargets })
  if (IsEqual.isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}
