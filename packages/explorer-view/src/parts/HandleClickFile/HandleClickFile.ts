import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'

export const handleClickFile = (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus = false): Promise<ExplorerState> => {
  const { applicationId } = state
  const completion = OpenUri.openUri(
    dirent.uri,
    !keepFocus,
    {
      preview: true,
    },
    applicationId,
  )
  const newState = {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
  return Promise.resolve(CommandCompletion.set(newState, completion))
}
