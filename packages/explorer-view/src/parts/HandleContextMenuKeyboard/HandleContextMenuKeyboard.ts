import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { handleContextMenuAtIndex } from '../HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

export const handleContextMenuKeyboard = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, x, y, minLineY, itemHeight } = state
  const menuX = x
  const menuY = y + (focusedIndex - minLineY + 1) * itemHeight
  return handleContextMenuAtIndex(state, focusedIndex, menuX, menuY)
}
