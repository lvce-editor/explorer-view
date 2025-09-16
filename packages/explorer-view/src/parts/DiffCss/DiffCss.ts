import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.scrollBarHeight === newState.scrollBarHeight && oldState.scrollBarActive === newState.scrollBarActive
}
