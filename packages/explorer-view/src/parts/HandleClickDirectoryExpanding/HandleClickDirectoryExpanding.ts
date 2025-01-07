import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'

export const handleClickDirectoryExpanding = async (state: ExplorerState, dirent: any, index: number, keepFocus: boolean): Promise<ExplorerState> => {
  dirent.type = DirentType.Directory
  dirent.icon = IconTheme.getIcon(dirent)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}
