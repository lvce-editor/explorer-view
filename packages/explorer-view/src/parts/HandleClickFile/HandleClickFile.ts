import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'

export const handleClickFile = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus = false): Promise<ExplorerState> => {
  OpenUri.openUriBackground(dirent.path, !keepFocus, {
    preview: true,
  })
  return {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
}
