import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  if (state.focusedIndex < 0) {
    return state
  }
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }
  const absolutePath = dirent.path
  try {
    // TODO handle error
    await FileSystem.remove(absolutePath)
  } catch {
    // TODO vscode shows error as alert (no stacktrace) and retry button
    // maybe should show alert as well, but where to put stacktrace?
    // on web should probably show notification (dialog)
    // ErrorHandling.handleError(error)
    // await ErrorHandling.showErrorDialog(error)
    return state
  }
  // TODO avoid state mutation
  // @ts-ignore
  const newVersion = ++state.version
  // TODO race condition
  // const newState = await loadContent(state:any)
  // @ts-ignore
  if (state.version !== newVersion || state.disposed) {
    return state
  }
  // TODO is it possible to make this more functional instead of mutating state?
  // maybe every function returns a new state?
  const index = state.items.indexOf(dirent)
  let deleteEnd = index + 1

  for (; deleteEnd < state.items.length; deleteEnd++) {
    if (state.items[deleteEnd].depth <= dirent.depth) {
      break
    }
  }
  const deleteCount = deleteEnd - index
  const newDirents = [...state.items]
  newDirents.splice(index, deleteCount)
  let indexToFocus = -1

  if (newDirents.length === 0) {
    indexToFocus = -1
  } else if (index < state.focusedIndex) {
    indexToFocus = state.focusedIndex - 1
  } else if (index === state.focusedIndex) {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  } else {
    indexToFocus = Math.max(state.focusedIndex - 1, 0)
  }
  const visible = newDirents.slice(state.minLineY, state.maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, state.fileIconCache)
  return {
    ...state,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
    focusedIndex: indexToFocus,
  }
}
