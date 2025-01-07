import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FocusIndex from '../FocusIndex/FocusIndex.ts'
import * as GetClickFn from '../GetClickFn/GetClickFn.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'
import * as GetParentStartIndex from '../GetParentStartIndex/GetParentStartIndex.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

// TODO rename dirents to items, then can use virtual list component directly
const setDeltaY = (state: ExplorerState, deltaY: number): ExplorerState => {
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

export const handleWheel = (state: ExplorerState, deltaMode: any, deltaY: any): any => {
  return setDeltaY(state, state.deltaY + deltaY)
}

// TODO use posInSet and setSize properties to compute more effectively

// TODO much shared logic with newFolder

const handleClickFile = async (state: ExplorerState, dirent: any, index: number, keepFocus = false): Promise<any> => {
  // await Command.execute(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}

const handleClickDirectoryExpanded = (state: ExplorerState, dirent: any, index: number, keepFocus: boolean): any => {
  const { minLineY, maxLineY, itemHeight } = state
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  const endIndex = GetParentEndIndex.getParentEndIndex(state.items, index)
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

export const handleClick = async (state: ExplorerState, index: number, keepFocus = false): Promise<ExplorerState> => {
  const { items, minLineY } = state
  if (index === -1) {
    return FocusIndex.focusIndex(state, -1)
  }
  const actualIndex = index + minLineY
  const dirent = items[actualIndex]
  if (!dirent) {
    console.warn(`[explorer] dirent at index ${actualIndex} not found`, state)
    return state
  }
  const clickFn = GetClickFn.getClickFn(dirent.type)
  return clickFn(state, dirent, actualIndex, keepFocus)
}

export const handleClickAt = (state: ExplorerState, button: number, x: number, y: number): any => {
  if (button !== MouseEventType.LeftClick) {
    return state
  }

  const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
  return handleClick(state, index)
}

export const handleClickCurrentButKeepFocus = (state: ExplorerState): Promise<ExplorerState> => {
  return handleClick(state, state.focusedIndex - state.minLineY, /* keepFocus */ true)
}

// export const handleBlur=()=>{}

const handleClickSymLink = async (state: ExplorerState, dirent: any, index: number): Promise<ExplorerState> => {
  const realPath = await FileSystem.getRealPath(dirent.path)
  const type = await FileSystem.stat(realPath)
  switch (type) {
    case DirentType.File:
      return handleClickFile(state, dirent, index)
    default:
      throw new Error(`unsupported file type ${type}`)
  }
}

const handleArrowRightDirectoryExpanded = (state: ExplorerState, dirent: any): ExplorerState => {
  const { items, focusedIndex } = state
  if (focusedIndex === items.length - 1) {
    return state
  }
  const nextDirent = items[focusedIndex + 1]
  if (nextDirent.depth === dirent.depth + 1) {
    return FocusIndex.focusIndex(state, focusedIndex + 1)
  }
  return state
}

export const handleArrowRight = async (state: ExplorerState): Promise<ExplorerState> => {
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
      return HandleClickDirectory.handleClickDirectory(state, dirent, focusedIndex)
    case DirentType.DirectoryExpanded:
      return handleArrowRightDirectoryExpanded(state, dirent)
    case DirentType.Symlink:
      return handleClickSymLink(state, dirent, focusedIndex)
    default:
      throw new Error(`unsupported file type ${dirent.type}`)
  }
}

const focusParentFolder = (state: ExplorerState): ExplorerState => {
  const parentStartIndex = GetParentStartIndex.getParentStartIndex(state.items, state.focusedIndex)
  if (parentStartIndex === -1) {
    return state
  }
  return FocusIndex.focusIndex(state, parentStartIndex)
}

export const handleArrowLeft = (state: ExplorerState): ExplorerState => {
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

// TODO maybe just insert items into explorer and refresh whole explorer
