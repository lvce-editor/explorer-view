import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as UpdateIcon from '../UpdateIcon/UpdateIcon.ts'

export const updateIcons = (state: ExplorerState): ExplorerState => {
  const newDirents = state.items.map(UpdateIcon.updateIcon)
  return {
    ...state,
    items: newDirents,
  }
}
