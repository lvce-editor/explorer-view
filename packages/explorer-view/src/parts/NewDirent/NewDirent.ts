import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Focus from '../Focus/Focus.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'

export const newDirent = async (state: ExplorerState, editingType: number): Promise<ExplorerState> => {
  // TODO make focus functional instead of side effect
  await Focus.setFocus(FocusKey.ExplorerEditBox)
  // TODO do it like vscode, select position between folders and files
  const { focusedIndex, items } = state
  if (focusedIndex >= 0) {
    const dirent = items[focusedIndex]
    if (dirent.type === DirentType.Directory) {
      // TODO handle error
      // @ts-ignore
      await HandleClickDirectory.handleClickDirectory(state, dirent, focusedIndex)
    }
  }
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType,
    editingValue: '',
    focus: FocusId.Input,
  }
}
