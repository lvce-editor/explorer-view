import * as CanBeDroppedInto from '../CanBeDroppedInto/CanBeDroppedInto.ts'
import { dropTargetFull } from '../DropTargetFull/DropTargetFull.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getNewDropTargets = (state: ExplorerState, index: number): readonly number[] => {
  const { items } = state
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
