import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import { getParentEndIndex } from '../GetParentEndIndex/GetParentEndIndex.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

// TODO rename dirents to items, then can use virtual list component directly

// TODO support multiselection and removing multiple dirents

// TODO use posInSet and setSize properties to compute more effectively

// TODO much shared logic with newFolder

const handleClickFile = async (state: any, dirent: any, index: any, keepFocus = false): Promise<any> => {
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

export const getClickFn = (direntType: any): any => {
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
