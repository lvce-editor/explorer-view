import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { handleDragOverIndex } from '../HandleDragOverIndex/HandleDragOverIndex.ts'

export const handleDragOver = (state: ExplorerState, x: number, y: number): ExplorerState => {
  const { isReadonly, root } = state
  Assert.number(x)
  Assert.number(y)
  if (isReadonly && root !== '') {
    return state
  }
  const index = getIndexFromPosition(state, x, y)
  return handleDragOverIndex(state, index)
}
