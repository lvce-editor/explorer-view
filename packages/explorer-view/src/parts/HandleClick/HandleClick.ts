import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'
import { getChildDirents, getIndexFromPosition, getParentEndIndex, getParentStartIndex } from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as OpenFolder from '../OpenFolder/OpenFolder.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

const updateIcon = (dirent: any): any => {
  return { ...dirent, icon: IconTheme.getIcon(dirent) }
}

const updateIcons = (state: any): any => {
  const newDirents = state.items.map(updateIcon)
  return {
    ...state,
    items: newDirents,
  }
}

export const handleIconThemeChange = (state: any) => {
  return updateIcons(state)
}

// TODO rename dirents to items, then can use virtual list component directly
const setDeltaY = (state: any, deltaY: any): any => {
  const { itemHeight, height, items } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
  }
}

export const handleWheel = (state: any, deltaMode: any, deltaY: any): any => {
  return setDeltaY(state, state.deltaY + deltaY)
}

const getFocusedDirent = (state: any) => {
  const { focusedIndex, minLineY, items } = state
  const dirent = items[focusedIndex + minLineY]
  return dirent
}

// TODO support multiselection and removing multiple dirents
export const removeDirent = async (state: any) => {
  if (state.focusedIndex < 0) {
    return state
  }
  const dirent = getFocusedDirent(state)
  const absolutePath = dirent.path
  try {
    // TODO handle error
    await FileSystem.remove(absolutePath)
  } catch (error) {
    // TODO vscode shows error as alert (no stacktrace) and retry button
    // maybe should show alert as well, but where to put stacktrace?
    // on web should probably show notification (dialog)
    // ErrorHandling.handleError(error)
    // await ErrorHandling.showErrorDialog(error)
    return
  }
  // TODO avoid state mutation
  const newVersion = ++state.version
  // TODO race condition
  // const newState = await loadContent(state:any)
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
  return {
    ...state,
    items: newDirents,
    focusedIndex: indexToFocus,
  }
}

export const renameDirent = (state: any) => {
  const { focusedIndex, items } = state
  const item = items[focusedIndex]
  // Focus.setFocus(FocusKey.ExplorerEditBox)
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
  }
}

// TODO use posInSet and setSize properties to compute more effectively

export const cancelEdit = (state: any): any => {
  const { editingIndex } = state
  return {
    ...state,
    focusedIndex: editingIndex,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
  }
}

export const copyRelativePath = async (state: any): Promise<any> => {
  const dirent = getFocusedDirent(state)
  // @ts-ignore
  const relativePath = dirent.path.slice(1)
  // TODO handle error

  // await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ relativePath)
  return state
}

export const copyPath = async (state: any): Promise<any> => {
  const dirent = getFocusedDirent(state)
  // TODO windows paths
  // TODO handle error
  // @ts-ignore
  const path = dirent.path
  // await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, /* text */ path)
  return state
}

// TODO much shared logic with newFolder

const handleClickFile = async (state: any, dirent: any, index: any, keepFocus = false) => {
  // await Command.execute(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const handleClickDirectory = async (state: any, dirent: any, index: any, keepFocus: boolean): Promise<any> => {
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await getChildDirents(state.pathSeparator, dirent)
  const state2 = {} as any
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.items.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  dirent.type = DirentType.DirectoryExpanded
  dirent.icon = IconTheme.getIcon(dirent)
  const { height, itemHeight, minLineY } = state2
  // TODO when focused index has changed while expanding, don't update it
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  return {
    ...state,
    items: newDirents,
    focusedIndex: newIndex,
    focused: keepFocus,
    maxLineY,
  }
}

const handleClickDirectoryExpanding = (state: any, dirent: any, index: any, keepFocus: boolean): any => {
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const handleClickDirectoryExpanded = (state: any, dirent: any, index: any, keepFocus: boolean): any => {
  const { minLineY, maxLineY, itemHeight } = state
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = getParentEndIndex(state.items, index)
  const removeCount = endIndex - index - 1
  // TODO race conditions and side effects are everywhere
  const newDirents = [...state.items]
  newDirents.splice(index + 1, removeCount)
  const newTotal = newDirents.length
  if (newTotal < maxLineY) {
    const visibleItems = Math.min(maxLineY - minLineY, newTotal)
    const newMaxLineY = Math.min(maxLineY, newTotal)
    const newMinLineY = newMaxLineY - visibleItems
    const deltaY = newMinLineY * itemHeight
    return {
      ...state,
      items: newDirents,
      focusedIndex: index,
      focused: keepFocus,
      minLineY: newMinLineY,
      maxLineY: newMaxLineY,
      deltaY,
    }
  }
  return {
    ...state,
    items: newDirents,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const getClickFn = (direntType: any): any => {
  switch (direntType) {
    case DirentType.File:
    case DirentType.SymLinkFile:
      return handleClickFile
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      return handleClickDirectory
    case DirentType.DirectoryExpanding:
      return handleClickDirectoryExpanding
    case DirentType.DirectoryExpanded:
      return handleClickDirectoryExpanded
    case DirentType.Symlink:
      return handleClickSymLink
    case DirentType.CharacterDevice:
      throw new Error('Cannot open character device files')
    case DirentType.BlockDevice:
      throw new Error('Cannot open block device files')
    case DirentType.Socket:
      throw new Error('Cannot open socket files')
    default:
      throw new Error(`unsupported dirent type ${direntType}`)
  }
}

export const handleClick = (state: any, index: any, keepFocus = false) => {
  const { items, minLineY } = state
  if (index === -1) {
    return focusIndex(state, -1)
  }
  const actualIndex = index + minLineY
  const dirent = items[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  const clickFn = getClickFn(dirent.type)
  return clickFn(state, dirent, actualIndex, keepFocus)
}

export const handleClickAt = (state: any, button: any, x: any, y: any): any => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = getIndexFromPosition(state, x, y)
  return handleClick(state, index)
}

export const handleClickCurrentButKeepFocus = (state: any) => {
  return handleClick(state, state.focusedIndex - state.minLineY, /* keepFocus */ true)
}

// export const handleBlur=()=>{}

const handleClickSymLink = async (state: any, dirent: any, index: any): Promise<any> => {
  const realPath = await FileSystem.getRealPath(dirent.path)
  const type = await FileSystem.stat(realPath)
  switch (type) {
    case DirentType.File:
      return handleClickFile(state, dirent, index)
    default:
      throw new Error(`unsupported file type ${type}`)
  }
}

const handleArrowRightDirectoryExpanded = (state: any, dirent: any) => {
  const { items, focusedIndex } = state
  if (focusedIndex === items.length - 1) {
    return state
  }
  const nextDirent = items[focusedIndex + 1]
  if (nextDirent.depth === dirent.depth + 1) {
    return focusIndex(state, focusedIndex + 1)
  }
}

export const handleArrowRight = async (state: any): Promise<any> => {
  const { items, focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  switch (dirent.type) {
    case DirentType.File:
    case DirentType.SymLinkFile:
      return state
    case DirentType.Directory:
    case DirentType.SymLinkFolder:
      // @ts-ignore
      return handleClickDirectory(state, dirent, focusedIndex)
    case DirentType.DirectoryExpanded:
      return handleArrowRightDirectoryExpanded(state, dirent)
    case DirentType.Symlink:
      return handleClickSymLink(state, dirent, focusedIndex)
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}

const focusParentFolder = (state: any) => {
  const parentStartIndex = getParentStartIndex(state.items, state.focusedIndex)
  if (parentStartIndex === -1) {
    return state
  }
  return focusIndex(state, parentStartIndex)
}

export const handleArrowLeft = (state: any) => {
  const { items, focusedIndex } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.File:
    case DirentType.SymLinkFile:
      return focusParentFolder(state)
    case DirentType.DirectoryExpanded:
      // @ts-ignore
      return handleClickDirectoryExpanded(state, dirent, focusedIndex)
    default:
      // TODO handle expanding directory and cancel file system call to read child dirents
      return state
  }
}

// TODO what happens when mouse leave and anther mouse enter event occur?
// should update preview instead of closing and reopening

export const handleBlur = (state: any): any => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  const { editingType } = state
  if (editingType !== ExplorerEditingType.None) {
    return state
  }
  return {
    ...state,
    focused: false,
  }
}

// TODO maybe just insert items into explorer and refresh whole explorer

export const handleClickOpenFolder = async (state: any): Promise<any> => {
  await OpenFolder.openFolder()
  return state
}
