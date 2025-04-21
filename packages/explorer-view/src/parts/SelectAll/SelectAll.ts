import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const selectAll = (state: ExplorerState): ExplorerState => {
  const { items } = state
  const newItems = items.map((item) => ({
    ...item,
    selected: true,
  }))
  return {
    ...state,
    items: newItems,
  }
}
