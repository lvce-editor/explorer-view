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

  // Get all selected items including the focused one
  const selectedItems = state.items.filter((item) => item.selected || item === dirent)
  if (selectedItems.length === 0) {
    return state
  }

  // Remove all selected items from the filesystem
  for (const item of selectedItems) {
    try {
      await FileSystem.remove(item.path)
    } catch {
      // TODO handle error
      return state
    }
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

  // Remove all selected items from the state
  const newDirents = state.items.filter((item) => !selectedItems.includes(item))

  // Find the new focus index
  let indexToFocus = -1
  if (newDirents.length === 0) {
    indexToFocus = -1
  } else {
    const lastSelectedIndex = Math.max(...selectedItems.map((item) => state.items.indexOf(item)))
    indexToFocus = Math.min(lastSelectedIndex, newDirents.length - 1)
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
