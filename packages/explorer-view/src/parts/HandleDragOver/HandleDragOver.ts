import * as Assert from '../Assert/Assert.ts'
import * as GetNewDropTargets from '../GetNewDropTargets/GetNewDropTargets.ts'
import * as IsEqual from '../IsEqual/IsEqual.ts'

export const handleDragOver = (state: any, x: number, y: number): any => {
  Assert.number(x)
  Assert.number(y)
  const { dropTargets } = state
  const newDropTargets = GetNewDropTargets.getNewDropTargets(state, x, y)
  if (IsEqual.isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}
