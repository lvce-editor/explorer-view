import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  // TODO compute css more optimized
  // maybe only when items change, and even then not
  // always, but only when it affects the css
  return (
    oldState.scrollBarHeight === newState.scrollBarHeight &&
    oldState.scrollBarActive === newState.scrollBarActive &&
    oldState.maxIndent === newState.maxIndent &&
    oldState.visibleExplorerItems === newState.visibleExplorerItems
  )
}
