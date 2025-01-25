import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as HandleClickDirectory from '../HandleClickDirectory/HandleClickDirectory.ts'

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
