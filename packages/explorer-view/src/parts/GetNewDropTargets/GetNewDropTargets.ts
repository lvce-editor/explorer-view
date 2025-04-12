import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CanBeDroppedInto from '../CanBeDroppedInto/CanBeDroppedInto.ts'
import { dropTargetFull } from '../DropTargetFull/DropTargetFull.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'

export const getNewDropTargets = (state: ExplorerState, x: number, y: number): readonly number[] => {
  const { items } = state
  const index = getIndexFromPosition(state, x, y)
  if (index === -1) {
    return dropTargetFull
  }
  const item = items[index]
  if (!CanBeDroppedInto.canBeDroppedInto(item)) {
    return []
  }
  const newDropTargets = [index]
  return newDropTargets
}
