import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'
import * as Focus from '../Focus/Focus.ts'

export const newDirent = async (state: any, editingType: any) => {
  Focus.setFocus(FocusKey.ExplorerEditBox)
  // TODO do it like vscode, select position between folders and files
  const { focusedIndex, items } = state
  if (focusedIndex >= 0) {
    const dirent = items[focusedIndex]
    if (dirent.type === DirentType.Directory) {
      // TODO handle error
      // @ts-ignore
      await HandleClickDirectory.handleCLickDirectory(state, dirent, focusedIndex)
    }
  }
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType,
    editingValue: '',
  }
}
