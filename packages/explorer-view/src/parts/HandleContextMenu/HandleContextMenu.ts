import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as ViewletExplorerHandleContextMenuKeyBoard from '../HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as ViewletExplorerHandleContextMenuMouseAt from '../HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const handleContextMenu = (state: ExplorerState, button: number, x: number, y: number): Promise<ExplorerState> => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletExplorerHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)
    default:
      return ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt(state, x, y)
  }
}
