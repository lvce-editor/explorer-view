import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenuKeyboard = async (state: any): Promise<any> => {
  const { focusedIndex, x, y, minLineY, itemHeight } = state
  const menuX = x
  const menuY = y + (focusedIndex - minLineY + 1) * itemHeight
  await ContextMenu.show(menuX, menuY, MenuEntryId.Explorer)
  return state
}
