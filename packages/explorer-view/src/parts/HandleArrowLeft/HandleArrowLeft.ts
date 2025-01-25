import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusParentFolder from '../FocusParentFolder/FocusParentFolder.ts'

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
      return FocusParentFolder.focusParentFolder(state)
    case DirentType.DirectoryExpanded:
      // @ts-ignore
      return handleClickDirectoryExpanded(state, dirent, focusedIndex)
    default:
      // TODO handle expanding directory and cancel file system call to read child dirents
      return state
  }
}
