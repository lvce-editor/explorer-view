import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenuAtIndex = async (state: ExplorerState, index: number, x: number, y: number): Promise<ExplorerState> => {
  Assert.number(x)
  Assert.number(y)
  const { uid } = state
  const newState: ExplorerState = {
    ...state,
    focusedIndex: index,
    focused: false,
  }
  ExplorerStates.set(uid, state, newState)
  await ContextMenu.show2(uid, MenuEntryId.Explorer, x, y, {
    menuId: MenuEntryId.Explorer,
  })
  return newState
}
