import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

export const handleCopy = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items } = state
  const dirents = getSelectedItems(items, focusedIndex)
  if (dirents.length === 0) {
    console.error('[ViewletExplorer/handleCopy] no dirent selected')
    return state
  }
  // TODO handle copy error gracefully
  const files = dirents.map((dirent) => dirent.uri)
  await ClipBoard.writeNativeFiles('copy', files)
  return {
    ...state,
    cutItems: [],
    pasteShouldMove: false,
  }
}
