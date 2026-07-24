import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'

export const handleClickFile = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus = false): Promise<ExplorerState> => {
  const completion = OpenUri.openUri(dirent.path, !keepFocus, {
    preview: true,
  })
  const newState = {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
  return CommandCompletion.set(newState, completion)
}
