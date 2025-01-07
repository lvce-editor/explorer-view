import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as UpdateIcon from '../UpdateIcon/UpdateIcon.ts'

export const updateIcons = (state: ExplorerState): ExplorerState => {
  const newDirents = state.items.map(UpdateIcon.updateIcon)
  return {
    ...state,
    items: newDirents,
  }
}
