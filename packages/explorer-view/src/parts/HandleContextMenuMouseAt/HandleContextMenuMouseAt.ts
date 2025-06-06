import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenuMouseAt = async (state: ExplorerState, x: number, y: number): Promise<ExplorerState> => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  const newState: ExplorerState = {
    ...state,
    focusedIndex,
    focused: false,
  }
  ExplorerStates.set(state.uid, state, newState)
  await ContextMenu.show(x, y, MenuEntryId.Explorer)
  return state
}
