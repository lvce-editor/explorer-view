import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { handleContextMenuAtIndex } from '../HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

export const handleContextMenuKeyboard = async (state: ExplorerState, index?: number): Promise<ExplorerState> => {
  const { focusedIndex, itemHeight, minLineY, x, y } = state
  const actualIndex = index === undefined ? focusedIndex : index
  const menuX = x
  const menuY = y + (actualIndex - minLineY + 1) * itemHeight
  return handleContextMenuAtIndex(state, actualIndex, menuX, menuY)
}
