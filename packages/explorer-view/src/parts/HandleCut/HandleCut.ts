import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

export const handleCut = async (state: ExplorerState): Promise<ExplorerState> => {
  // TODO handle multiple files
  // TODO if not file is selected, what happens?
  const { items, focusedIndex } = state
  const dirents = getSelectedItems(items, focusedIndex)
  if (dirents.length === 0) {
    return state
  }
  const files = dirents.map((dirent) => dirent.path)
  await ClipBoard.writeNativeFiles('cut', files)
  return {
    ...state,
    pasteShouldMove: true,
    cutItems: files,
  }
}
