import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import { getIndexFromPosition } from '../GetChildDirents/GetChildDirents.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuMouseAt = async (state: any, x: number, y: number): Promise<any> => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  await ContextMenu.show(x, y, MenuEntryId.Explorer)
  return {
    ...state,
    focusedIndex,
    focused: false,
  }
}
