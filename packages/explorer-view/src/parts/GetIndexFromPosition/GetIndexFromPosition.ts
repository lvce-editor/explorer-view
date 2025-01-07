import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export const getIndexFromPosition = (state: ExplorerState, eventX: number, eventY: number): any => {
  const { y, itemHeight, items } = state
  const index = Math.floor((eventY - y) / itemHeight)
  if (index < 0) {
    return 0
  }
  if (index >= items.length) {
    return -1
  }
  return index
}
