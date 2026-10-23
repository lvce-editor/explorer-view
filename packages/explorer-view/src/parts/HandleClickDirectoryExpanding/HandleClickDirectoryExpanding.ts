import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const handleClickDirectoryExpanding = (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  keepFocus: boolean,
): Promise<ExplorerState> => {
  // @ts-expect-error Legacy directory expansion mutates readonly items.
  dirent.type = DirentType.Directory
  return Promise.resolve({
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  })
}
